import "./Roll.css";
import Note from "~/entities/unit/model/Note";
import NoteComponent from "~/components/Note";
import { Selectable } from "~/utils/types.utils";

interface IRollComponentProps extends Selectable {
  notes: Note[];
}

const RollComponent: React.FC<IRollComponentProps> = ({ notes }) => {
  return (
    <>
      {notes.map(({ symbol, color, index }) => (
        <NoteComponent symbol={symbol} color={color} key={index} />
      ))}
    </>
  );
};

export default RollComponent;
