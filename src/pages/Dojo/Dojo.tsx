import React, { useEffect, useMemo } from "react";
import "./Dojo.css";
import Tact from "~/components/Tact";

import {
  enterBPMButtonClicked,
  isRepeatingCheckboxChanged,
  listenButtonClicked,
  pitcherUpdated,
  playButtonClicked,
  stopButtonClicked,
} from "~/features/dojo/ui";
import { pitchers } from "~/features/dojo/api/pitcher";
import {
  $bpm,
  $composition,
  $frequency,
  $pitcher,
  $isListening,
  $tact,
  $isPlaying,
  $isRepeating,
  $fraction,
  compositionRequested,
} from "~/features/dojo/model";
import { useStore } from "effector-react";
import { $failed, $success } from "~/features/dojo/model/score";
import { useParams } from "react-router-dom";

function Dojo() {
  const composition = useStore($composition);
  const pitcher = useStore($pitcher);
  const currentFrequency = useStore($frequency);
  const bpm = useStore($bpm);
  const isPlaying = useStore($isPlaying);
  const isListening = useStore($isListening);
  const isRepeating = useStore($isRepeating);
  const tact = useStore($tact);
  const fraction = useStore($fraction);
  const successScore = useStore($success);
  const failedScore = useStore($failed);

  const pitchersKeys = useMemo(() => Object.keys(pitchers), []);
  const { compositionId } = useParams();

  const expectedFrequencies = useMemo(
    () => fraction?.frequencies ?? [],
    [fraction]
  );

  useEffect(() => {
    if (compositionId) {
      compositionRequested(Number(compositionId));
    }
  }, [compositionId]);

  if (!composition) {
    return <h1>Loading...</h1>;
  }

  return (
    <main>
      {composition && (
        <section className="composition">
          <header className="composition__header">
            <h1 className="composition__title">{composition.name}</h1>
            <p className="composition__success">Success: {successScore}</p>
            <p className="composition__failed">Failed: {failedScore}</p>
            <p className="composition__frequency">
              Expected: {expectedFrequencies.join("|")} Hz
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
            <button
              disabled={!isListening}
              onClick={() => enterBPMButtonClicked()}
            >
              Enter BPM ({bpm})
            </button>
            <label>
              Repeat
              <input
                type="checkbox"
                checked={isRepeating}
                onChange={({ target: { checked } }) =>
                  isRepeatingCheckboxChanged(checked)
                }
              />
            </label>
            <select
              value={pitcher.name}
              onChange={(e) => pitcherUpdated(e.target.value)}
              disabled={!isListening}
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
            {composition.pattern.map(({ units, index }) => (
              <Tact
                key={index}
                selected={tact?.index === index}
                selectedUnitIndex={fraction?.index}
                units={units}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Dojo;
