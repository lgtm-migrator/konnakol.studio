import { Selectable } from "~/utils/types.utils";
import "./Note.css";

interface INoteComponentProps extends Selectable {
  symbol: string;
  color?: string;
}

function NoteComponent({ color, symbol }: INoteComponentProps) {
  return <span style={{ color }}>{symbol}</span>;
}

export default NoteComponent;
