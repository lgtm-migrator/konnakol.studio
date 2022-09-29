import "./Fraction.css";

interface IFractionComponentProps {
  symbol?: string;
  color?: string;
  selected: boolean;
}

function FractionComponent(props: IFractionComponentProps) {
  return (
    <div className={`fraction ${props.selected ? "fraction_selected" : ""}`}>
      <p className="fraction__unit" style={{ color: props.color }}>
        <span className={`fraction__symbol ${!props.symbol ? 'fraction__symbol_small' : ''}`}>
          {props.symbol ?? "·"}
        </span>
      </p>
    </div>
  );
}

export default FractionComponent;
