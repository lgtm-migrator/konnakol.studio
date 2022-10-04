import "./Note.css";

interface INoteComponentProps {
  symbol: string;
  color?: string;
}

function NoteComponent({ color, symbol }: INoteComponentProps) {
  return (
    <div className="unit unit--note">
      <span style={{ color }}>{symbol}</span>
    </div>
  );
}

export default NoteComponent;
