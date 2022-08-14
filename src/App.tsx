import React, { useEffect, useMemo, useState } from "react";
import { SullaLulla } from "./data/compositions";
import "./App.css";
import Tact from "./components/Tact";

import {
  bpmToMilliseconds,
  millisecondsToBPM,
} from "./utils/tempo.utils";
import { dojoUIMounted, pitcherUpdated, playButtonClicked } from '~/features/dojo/ui';
import { pitchers } from '~/features/dojo/api/pitcher';
import { $failed, $frequency, $pitcher, $success } from './features/dojo/model';
import { useStore } from 'effector-react';

function App() {
  const [composition] = useState(SullaLulla);
  const [tempo, setTempo] = useState(bpmToMilliseconds(composition.tempo));
  const [currentFraction, setCurrentFraction] = useState(0);
  const [currentTact, setCurrentTact] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const pitcher = useStore($pitcher)
  const success = useStore($success)
  const failed = useStore($failed)
  const currentFrequency = useStore($frequency)

  const pitchersKeys = useMemo(
    () => Object.keys(pitchers),
    []
  )

  useEffect(() => {
    dojoUIMounted()
  }, [])

  const currentUnit =
    composition.pattern?.[currentTact]?.[currentFraction]?.unit;
  const expectedFrequency = currentUnit?.frequency ?? 0;


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
          <button onClick={() => playButtonClicked()}>
            {isPlaying ? "Stop" : "Play"}
          </button>
          <button>
            Enter BPM ({millisecondsToBPM(tempo)})
          </button>
          <select value={pitcher.name} onChange={e => pitcherUpdated(e.target.value)}>
            {pitchersKeys.map(pitcher => <option>{pitcher}</option>)}
          </select>
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
