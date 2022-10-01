import { Frequency } from '~/types/fraction.types';
import Fraction from './Fraction';

export enum UnitKind {
  Roll = 'roll',
  Chord = 'chord',
  Fraction = 'fraction'
}

export default interface Unit {
  readonly kind: UnitKind
  readonly index: number
  readonly fractions: Fraction[] | null
  play: (bpm: number) => AsyncGenerator<Fraction[]>
  check: (receivedFrequency: Frequency) => boolean
}