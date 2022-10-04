import "./Unit.css";
import React from "react";
import Note from "~/components/Note";
import Chord from "~/components/Chord";
import Roll from "~/components/Roll";
import { AnyUnit } from "~/entities/unit/model/Unit";
import { isChord, isNote, isRoll } from "~/entities/unit/model";


interface IUnitProps {
  selected: boolean;
  unit: AnyUnit;
}

const UnitComponent: React.FC<IUnitProps> = ({ unit, selected }) => {
  if (isNote(unit)) {
    return <Note symbol={unit.symbol} color={unit.color} />;
  }

  if (isChord(unit)) {
    return <Chord notes={unit.children} />;
  }

  if (isRoll(unit)) {
    return <Roll notes={unit.children} />;
  }

  return <div>???</div>;
};

export default UnitComponent;
