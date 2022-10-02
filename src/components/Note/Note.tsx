import "./Note.css";

interface INoteComponentProps {
  symbol?: string;
  color?: string;
  selected: boolean;
}

function NoteComponent({ color, selected, symbol }: INoteComponentProps) {
  return (
    <div className="unit unit--note">
      <span style={{ color }}>{symbol}</span>
    </div>
  );
}

export default NoteComponent;
