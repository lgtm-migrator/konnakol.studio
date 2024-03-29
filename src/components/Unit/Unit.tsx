import "./Unit.css";
import React from "react";
import Note from "~/components/Note";
import Chord from "~/components/Chord";
import Roll from "~/components/Roll";
import { isChord, isNote, isRoll } from "~/entities/unit/model";
import Unit from '~/entities/unit/model/Unit';

interface IUnitProps {
  selected: boolean;
  unit: Unit;
}

const UnitComponent: React.FC<IUnitProps> = ({ unit, selected }) => {
  let component = <div>???</div>;

  if (isNote(unit)) {
    component = <Note symbol={unit.symbol} color={unit.color} />;
  }

  if (isChord(unit)) {
    component = <Chord notes={unit.children} />;
  }

  if (isRoll(unit)) {
    component = <Roll notes={unit.children} />;
  }

  return (
    <div
      className={`unit unit--${unit.kind} ${selected ? "unit--selected" : ""}`}
    >
      {component}
    </div>
  );
};

export default UnitComponent;
