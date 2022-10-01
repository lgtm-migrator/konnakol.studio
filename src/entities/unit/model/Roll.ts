import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { areFrequenciesCorrect } from '~/utils/frequency.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Fraction from './Fraction';
import Unit, { UnitKind } from './Unit';

export default class Roll implements Unit {
  public readonly kind = UnitKind.Roll
  public currentFraction: Fraction | null = null

  constructor(public readonly index: number, public readonly fractions: Fraction[]) { }

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm) / this.fractions.length

    for (const fraction of this.fractions) {
      await sleep(interval)
      yield [fraction]
      this.currentFraction = fraction
    }
  }

  check(receivedFrequency: Frequency) {
    if (!this.currentFraction) {
      throw new Error('Roll is not being played now.')
    }

    return areFrequenciesCorrect(this.currentFraction.possibleFrequencies, receivedFrequency)
  }
}