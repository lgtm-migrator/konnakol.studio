import { Unit } from '~/entities/unit/model';

export interface Fraction<U = Unit | null> {
  unit: U
  color?: string
}

export interface FractionWithIndex<U = Unit | null> extends Fraction<U> {
  index: number
}

export type Tact = Fraction[]
export type Pattern = Tact[]
