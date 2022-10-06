import NoteComponent from '~/components/Note';
import { SingleUnit } from '~/entities/unit/model';

interface ISingleUnitCollectionProps {
  units: SingleUnit[];
}

function SingleUnitCollection({ units }: ISingleUnitCollectionProps) {
  return (
    <div className="units-collection">
      {units.map((unit, i) => (
        <NoteComponent symbol={unit.symbol} key={i} />
      ))}
    </div>
  );
}

export default SingleUnitCollection