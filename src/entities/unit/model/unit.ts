import { Frequency } from '~/types/fraction.types';

export enum UnitKind {
  Composite = 'composite',
  Single = 'single'
}

export enum UnitType {
  Note = 'note',
  Chord = 'chord',
  Roll = 'roll'
}

export default interface Unit {
  readonly kind: UnitKind
  readonly type: UnitType
  readonly index: number
  play: (bpm: number) => AsyncGenerator<Unit>
  check: (receivedFrequency: Frequency) => boolean
}

export interface SingleUnit extends Unit {
  readonly kind: UnitKind.Single
  readonly type: UnitType.Note
  readonly symbol: string
  readonly color: string
  readonly frequencies: Frequency[]
}

export interface CompositeUnit<Children extends SingleUnit[]> extends Unit {
  readonly kind: UnitKind.Composite
  readonly type: UnitType.Chord | UnitType.Roll
  readonly children: Children
}
