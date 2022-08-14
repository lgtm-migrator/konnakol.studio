import { Fraction } from '~/entities/fraction/model'

export interface Composition {
  id: number
  name: string
  pattern: Fraction[][]
  tempo: number
  size: number
}

