import "./Tact.css";

import Unit from "~/entities/unit/model/Unit";
import UnitComponent from "~/components/Unit";

interface ITactProps {
  units: Unit[];
  selected: boolean;
  selectedUnitIndex: number;
}

function Tact(props: ITactProps) {
  return (
    <div className={`tact ${props.selected ? "tact_selected" : ""}`}>
      {props.units.map((unit, i) => (
        <UnitComponent
          unit={unit}
          selected={props.selectedUnitIndex === unit.index}
        />
      ))}
    </div>
  );
}

export default Tact;
