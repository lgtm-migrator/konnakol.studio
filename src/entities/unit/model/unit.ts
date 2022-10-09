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
  play: (bpm: number) => AsyncGenerator<Unit & WithFrequencies>
  check: (receivedFrequency: Frequency) => boolean
}

export interface WithFrequencies {
  readonly frequencies: Frequency[]
}

export interface Renderable {
  readonly symbol: string
  readonly color: string
}

export interface SingleUnit extends Unit, Renderable, WithFrequencies {
  readonly kind: UnitKind.Single
  readonly type: UnitType.Note
}

export interface CompositeUnit<Children extends Unit[]> extends Unit {
  readonly kind: UnitKind.Composite
  readonly type: UnitType.Chord | UnitType.Roll
  readonly children: Children
}
