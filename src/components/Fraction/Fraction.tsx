import "./Fraction.css";

interface IFractionProps {
  symbol: string;
  color?: string;
  selected: boolean;
}

function Fraction(props: IFractionProps) {
  return (
    <div className={`fraction ${props.selected ? "fraction_selected" : ""}`}>
      <p style={{ color: props.color }}>
        <span>{props.symbol}</span>
      </p>
    </div>
  );
}

export default Fraction;
