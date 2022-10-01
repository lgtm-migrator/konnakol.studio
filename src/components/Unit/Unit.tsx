import React from "react";
import Fraction from "~/components/Fraction";
import Chord from "~/components/Chord";
import Roll from "~/components/Roll";
import Unit, { UnitKind } from "~/entities/unit/model/Unit";

interface IUnitProps {
  selected: boolean;
  unit: Unit;
}

const UnitComponent: React.FC<IUnitProps> = ({ unit, selected }) => {
  switch (unit.kind) {
    case UnitKind.Fraction:
      return <Fraction selected={selected} />;
    case UnitKind.Chord:
      return <Chord />;
    case UnitKind.Roll:
      return <Roll />;
  }
};

export default UnitComponent;
