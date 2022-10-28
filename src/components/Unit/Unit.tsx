import "./Unit.css";
import React from "react";
import Note from "~/components/Note";
import Chord from "~/components/Chord";
import Roll from "~/components/Roll";
import { isChord, isNote, isRoll } from "~/entities/unit/model";
import Unit from "~/entities/unit/model/Unit";
import classNames from "classnames";

interface IUnitProps {
  unit: Unit;
  selected?: boolean;
}

const UnitComponent: React.FC<IUnitProps> = ({ unit, selected = false }) => {
  let component = <div>???</div>;

  if (isNote(unit)) {
    component = <Note symbol={unit.symbol} color={unit.color} />;
  }

  if (isChord(unit)) {
    component = <Chord notes={unit.children} />;
  }

  if (isRoll(unit)) {
    component = <Roll beats={unit.children} />;
  }

  return (
    <div
      className={classNames("unit-wrapper", {
        "unit-wrapper--selected": selected,
      })}
    >
      {component}
    </div>
  );
};

export default UnitComponent;
