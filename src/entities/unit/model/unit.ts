export interface Unit {
  symbol: string
  frequency: number
}

export const createUnit = (symbol: string, frequency: number): Unit => ({ frequency, symbol })
