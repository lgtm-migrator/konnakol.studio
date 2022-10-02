import { ChordNotes } from "~/entities/unit/model/shared";
import "./Chord.css";

interface IChordComponentProps {
  notes: ChordNotes;
}

const ChordComponent: React.FC<IChordComponentProps> = ({ notes }) => {
  return (
    <div className="unit unit--chord">
      {notes.map(({ symbol, color }, i) => (
        <span style={{ color }} key={`${color}-${symbol}#${i}`}>
          {symbol}
        </span>
      ))}
    </div>
  );
};

export default ChordComponent;
