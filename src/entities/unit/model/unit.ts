export type Frequency = number

export interface Unit {
  symbol: string
  frequency: Frequency
}

export const createUnit = (symbol: string, frequency: Frequency): Unit => ({ frequency, symbol })
