import "./Tact.css";

import { IFraction } from "../../types/fraction.types";
import Fraction from "../Fraction/Fraction";

interface ITactProps {
  fractions: Array<IFraction>;
  selected: boolean;
  selectedFraction: number;
}

function Tact(props: ITactProps) {
  return (
    <div className={`tact ${props.selected ? "tact_selected" : ""}`}>
      {props.fractions.map((fr, i) => (
        <Fraction
          key={i}
          symbol={fr.unit?.symbol ?? "·"}
          color={fr.color}
          selected={props.selected && props.selectedFraction === i}
        />
      ))}
    </div>
  );
}

export default Tact;
