import React from "react";
import Note from "~/components/Note";
import Chord from "~/components/Chord";
import Roll from "~/components/Roll";
import { AnyUnit } from "~/entities/unit/model/Unit";
import { isChord, isNote } from "~/entities/unit/model";
import { UnitKind } from "~/entities/unit/model/shared";

interface IUnitProps {
  selected: boolean;
  unit: AnyUnit;
}

const UnitComponent: React.FC<IUnitProps> = ({ unit, selected }) => {
  switch (unit.kind) {
    case UnitKind.Note:
      return isNote(unit) ? (
        <Note selected={selected} symbol={unit.symbol} color={unit.color} />
      ) : (
        <div>???</div>
      );
    case UnitKind.Chord:
      return isChord(unit) ? <Chord notes={unit.children} /> : <div>???</div>;
    case UnitKind.Roll:
      return <Roll />;
    default:
      return null;
  }
};

export default UnitComponent;
