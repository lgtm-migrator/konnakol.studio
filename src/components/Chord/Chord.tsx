import { SingleUnit } from '~/entities/unit/model';
import { Selectable } from '~/utils/types.utils';
import "./Chord.css";

interface IChordComponentProps extends Selectable {
  notes: SingleUnit[];
}

const ChordComponent: React.FC<IChordComponentProps> = ({ notes, selected }) => {
  return (
    <>
      {notes.map(({ symbol, color }, i) => (
        <span style={{ color }} key={`${color}-${symbol}#${i}`}>
          {symbol}
        </span>
      ))}
    </>
  );
};

export default ChordComponent;
