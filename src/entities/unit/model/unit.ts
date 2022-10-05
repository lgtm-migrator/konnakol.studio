import { Frequency } from '~/types/fraction.types';
import { UnitKind } from './shared';

export default interface Unit {
  readonly kind: UnitKind
  readonly index: number
  play: (bpm: number) => AsyncGenerator<Unit>
  check: (receivedFrequency: Frequency) => boolean
}

export interface SingleUnit extends Unit {
  readonly symbol: string
  readonly color: string
  readonly frequencies: Frequency[]
}

export interface CompositeUnit<Children extends SingleUnit[]> extends Unit {
  readonly children: Children
}
