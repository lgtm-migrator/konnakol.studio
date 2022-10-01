import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { areFrequenciesCorrect } from '~/utils/frequency.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Fraction from './Fraction';
import Unit, { UnitKind } from './Unit';

export default class Chord implements Unit {
  kind = UnitKind.Chord;

  constructor(public readonly index: number, public readonly fractions: Fraction[]) { }

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm)
    await sleep(interval)
    yield this.fractions
  }

  check(receivedFrequency: Frequency) {
    const frequencies = this.fractions.flatMap(({ possibleFrequencies }) => possibleFrequencies)
    return areFrequenciesCorrect(frequencies, receivedFrequency)
  }
}