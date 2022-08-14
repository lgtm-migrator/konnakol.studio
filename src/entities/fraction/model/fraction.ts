import { Unit } from '~/entities/unit/model';

export interface Fraction {
  unit: Unit | null
  index: number
  color?: string
}