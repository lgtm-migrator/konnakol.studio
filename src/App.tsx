import React, { useEffect, useState } from "react";
import { Maqsoum } from "./data/compositions";
import "./App.css";
import Tact from "./components/Tact";
import { bpmToMilliseconds, millisecondsToBPM } from "./utils/tempo.utils";

function App() {
  const [composition] = useState(Maqsoum);
  const [tempo, setTempo] = useState(bpmToMilliseconds(composition.tempo));
  const [currentFraction, setCurrentFraction] = useState(0);
  const [currentTact, setCurrentTact] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const isPlaying = Boolean(intervalId);

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

  const play = () => {
    const interval = window.setInterval(() => {
      setCurrentFraction((prev) => prev + 1);
    }, tempo);

    setIntervalId(interval);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    if (!intervalId) {
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
  }, [
    composition.pattern.length,
    composition.size,
    currentFraction,
    currentTact,
    intervalId,
  ]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [intervalId]);

  return (
    <main>
      <section className="composition">
        <header className="composition__header">
          <h1 className="composition__title">{composition.name}</h1>
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
