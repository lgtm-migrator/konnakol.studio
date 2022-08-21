import { Unit } from '~/entities/unit/model';

export interface Fraction {
  unit: Unit | null
  color?: string
}

export interface FractionWithIndex extends Fraction {
  index: number
}

export type Tact = Fraction[]
export type Pattern = Tact[]
