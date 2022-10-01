import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { isFrequencyCorrect } from '~/utils/frequency.utils';
import Unit, { UnitKind } from './Unit';

interface FractionConfig {
  possibleFrequencies: Frequency[]
  symbol: string
  color?: string
}

export default class Fraction implements Unit {
  kind = UnitKind.Fraction
  fractions = null

  possibleFrequencies: Frequency[]

  symbol: string
  color?: string

  constructor(public readonly index: number, config: FractionConfig) {
    if (config.possibleFrequencies.length > 1) {
      throw new Error('Fraction can have one or no possible frequencies.')
    }

    this.possibleFrequencies = config.possibleFrequencies
    this.color = config.color
    this.symbol = config.symbol
  }

  async *play(bpm: number) {
    await sleep(bpm)
    yield [this]
  }

  check(receivedFrequency: Frequency) {
    const [expectedFrequency = null] = this.possibleFrequencies

    if (!expectedFrequency) {
      return true;
    }

    return isFrequencyCorrect(expectedFrequency, receivedFrequency)
  }
}
