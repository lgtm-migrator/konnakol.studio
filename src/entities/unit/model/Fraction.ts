import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import Unit, { UnitKind } from './Unit';

interface FractionConfig {
  index: number
  possibleFrequencies: Frequency[]
  symbol: string
  color?: string
}

export default class Fraction implements Unit {
  kind = UnitKind.Fraction
  fractions = null
  index: number
  possibleFrequencies: Frequency[]
  symbol: string
  color?: string

  constructor(config: FractionConfig) {
    this.possibleFrequencies = config.possibleFrequencies
    this.color = config.color
    this.index = config.index
    this.symbol = config.symbol
  }

  async *play(bpm: number) {
    await sleep(bpm)
    yield [this]
  }
}
