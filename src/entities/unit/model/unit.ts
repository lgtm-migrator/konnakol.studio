import { Frequency } from '~/types/fraction.types';
import Note from './Note';
import { UnitChildren, UnitKind } from './shared';

export default interface Unit<Children extends UnitChildren> {
  readonly kind: UnitKind
  readonly children: Children
  readonly index: number
  readonly symbol: string
  play: (bpm: number) => AsyncGenerator<Note[]>
  check: (receivedFrequency: Frequency) => boolean
}

export type AnyUnit = Unit<UnitChildren>