import { Unit } from '~/entities/unit/model';

export interface Fraction {
  unit: Unit | null
  color?: string
}

export interface FractionWithIndex extends Fraction {
  index: number
}

export type RawTact = Fraction[]
export type RawPattern = RawTact[]

export type PreparedTact = FractionWithIndex[]
export type PreparedPattern = PreparedTact[]

export const prepareTact = (tact: RawTact): PreparedTact => tact.map((fraction, index) => ({ ...fraction, index }))
