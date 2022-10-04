import "./Roll.css";
import Note from "~/entities/unit/model/Note";
import NoteComponent from "~/components/Note";

interface IRollComponentProps {
  notes: Note[];
}

const RollComponent: React.FC<IRollComponentProps> = ({ notes }) => {
  return (
    <div className="unit unit--roll">
      {notes.map(({ symbol, color, index }) => (
        <NoteComponent symbol={symbol} color={color} key={index} />
      ))}
    </div>
  );
};

export default RollComponent;
