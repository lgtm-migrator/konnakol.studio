import React, { useMemo } from "react";
import "./App.css";
import Tact from "./components/Tact";

import {
  listenButtonClicked,
  pitcherUpdated,
  playButtonClicked,
  stopButtonClicked,
} from "~/features/dojo/ui";
import { pitchers } from "~/features/dojo/api/pitcher";
import {
  $bpm,
  $composition,
  $failed,
  $fraction,
  $frequency,
  $pitcher,
  $success,
  $tact,
  $isListening,
  checkCompositionFx,
} from "./features/dojo/model";
import { useStore } from "effector-react";

function App() {
  const composition = useStore($composition);
  const pitcher = useStore($pitcher);
  const success = useStore($success);
  const failed = useStore($failed);
  const currentFrequency = useStore($frequency);
  const bpm = useStore($bpm);
  const isPlaying = useStore(checkCompositionFx.pending);
  const isListening = useStore($isListening);
  const currentTact = useStore($tact);
  const currentFraction = useStore($fraction);

  const pitchersKeys = useMemo(() => Object.keys(pitchers), []);

  const expectedFrequency = currentFraction?.unit?.frequency ?? 0;

  return (
    <main>
      {composition && (
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
            <button
              style={{ backgroundColor: isListening ? "green" : "red" }}
              onClick={() => listenButtonClicked()}
              disabled={isListening}
            >
              Listening [{!isListening ? "off" : "on"}]
            </button>
            <button
              disabled={!isListening}
              onClick={() =>
                !isPlaying ? playButtonClicked() : stopButtonClicked()
              }
            >
              {isPlaying ? "Stop" : "Play"}
            </button>
            <button>Enter BPM ({bpm})</button>
            <select
              value={pitcher.name}
              onChange={(e) => pitcherUpdated(e.target.value)}
            >
              {pitchersKeys.map((pitcher, index) => (
                <option key={index}>{pitcher}</option>
              ))}
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
                selectedFraction={currentFraction?.index}
                fractions={tact}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
