import React, { useEffect, useRef, useState } from "react";
import { ACF2PLUS, AMDF, DynamicWavelet } from "pitchfinder";
import { SullaLulla } from "./data/compositions";
import "./App.css";
import Tact from "./components/Tact";

import {
  bpmToMilliseconds,
  millisecondsToBPM,
  tick,
} from "./utils/tempo.utils";
import { isFrequencyCorrect } from "./utils/frequency.utils";

const detectPitch = ACF2PLUS({ sampleRate: 48000 });

function App() {
  const [composition] = useState(SullaLulla);
  const [tempo, setTempo] = useState(bpmToMilliseconds(composition.tempo));
  const [currentFraction, setCurrentFraction] = useState(0);
  const [currentTact, setCurrentTact] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [passed, setPassed] = useState(false);

  const requestRef = useRef<number | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);

  const enterBPM = () => {
    const bpm = prompt("Enter BPM", "120");

    if (!bpm) {
      return alert("No BPM provided.");
    }

    if (isNaN(+bpm)) {
      return alert("BPM must be an integer value.");
    }

    setTempo(bpmToMilliseconds(+bpm));
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      disablePitcher();
      setIsPlaying(false);
    }
  };

  const pitch = () => {
    if (bufferRef.current && analyserNodeRef.current) {
      analyserNodeRef.current.getFloatTimeDomainData(bufferRef.current);
      const frequency = detectPitch(bufferRef.current);
      frequency && setCurrentFrequency(frequency);
      requestRef.current = requestAnimationFrame(pitch);
    }
  };

  const enablePitcher = async () => {
    const audioContext = new window.AudioContext();
    const micStream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const analyserAudioNode = audioContext.createAnalyser();
    analyserAudioNode.fftSize = 2048;
    analyserAudioNode.minDecibels = -100;
    analyserAudioNode.maxDecibels = -10;
    analyserAudioNode.smoothingTimeConstant = 0.85;

    const sourceAudioNode = audioContext.createMediaStreamSource(micStream);
    sourceAudioNode.connect(analyserAudioNode);
    const buffer = new Float32Array(analyserAudioNode.fftSize);

    analyserNodeRef.current = analyserAudioNode;
    bufferRef.current = buffer;
    requestRef.current = requestAnimationFrame(pitch);
  };

  const disablePitcher = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  };

  const play = async () => {
    setIsPlaying(true);
    await tick(3, tempo);

    const interval = window.setInterval(() => {
      setCurrentFraction((prev) => prev + 1);
    }, tempo);

    setIntervalId(interval);
    enablePitcher();
  };

  const currentUnit =
    composition.pattern?.[currentTact]?.[currentFraction]?.unit;
  const expectedFrequency = currentUnit?.frequency ?? 0;

  useEffect(() => {
    if (!intervalId) {
      setCurrentTact(0);
      setCurrentFraction(0);
      setIsPlaying(false);
      return console.log("Finished.");
    }

    if (currentTact >= composition.pattern.length) {
      clearInterval(intervalId);
      return setIntervalId(null);
    }

    if (currentFraction >= composition.size) {
      setCurrentFraction(0);
      return setCurrentTact((prev) => prev + 1);
    }

    if (!currentUnit) {
      return setPassed(true);
    }

    if (!passed && isFrequencyCorrect(expectedFrequency, currentFrequency)) {
      setSuccess((prev) => prev + 1);
      setPassed(true);
    }
  }, [
    composition.pattern,
    composition.pattern.length,
    composition.size,
    currentFraction,
    currentFrequency,
    currentTact,
    currentUnit,
    expectedFrequency,
    intervalId,
    passed,
  ]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    return () => {
      disablePitcher();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !currentUnit || !currentFraction) {
      return;
    }

    if (!passed) {
      setFailed(prev => prev + 1)
    }

    setPassed(false);
  }, [currentFraction, isPlaying, currentUnit])

  return (
    <main>
      <section className="composition">
        <header className="composition__header">
          <h1 className="composition__title">{composition.name}</h1>
          <p className="composition__success">Success: {success}</p>
          <p className="composition__failed">Failed: {failed}</p>
          <p className="composition__frequency">
            Expected: {expectedFrequency.toFixed(2)} Hz
          </p>
          <p className="composition__frequency">
            Received: {currentFrequency.toFixed(2)} Hz
          </p>
          <button onClick={isPlaying ? stop : play}>
            {isPlaying ? "Stop" : "Play"}
          </button>
          <button onClick={enterBPM}>
            Enter BPM ({millisecondsToBPM(tempo)})
          </button>
        </header>
        <div className="composition__size">
          {new Array(composition.size).fill(1).map((_, fractionIndex) => (
            <span key={fractionIndex} className="fraction-index">
              {fractionIndex + 1}
            </span>
          ))}
        </div>
        <div className="composition__pattern">
          {composition.pattern.map((tact, i) => (
            <Tact
              key={i}
              selected={isPlaying && currentTact === i}
              selectedFraction={currentFraction}
              fractions={tact}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
