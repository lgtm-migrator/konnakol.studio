import "./Roll.css";
import NoteComponent from "~/components/Note";
import ChordComponent from "~/components/Chord";
import { Selectable } from "~/utils/types.utils";
import { isChord, RollChildren } from "~/entities/unit/model";

interface IRollComponentProps extends Selectable {
  beats: RollChildren;
}

const RollComponent: React.FC<IRollComponentProps> = ({ beats }) => {
  return (
    <div className="unit--type--roll">
      {beats.map((beat, i) => {
        if (isChord(beat)) {
          return <ChordComponent notes={beat.children} key={i} />;
        }

        return (
          <NoteComponent symbol={beat.symbol} color={beat.color} key={i} />
        );
      })}
    </div>
  );
};

export default RollComponent;
