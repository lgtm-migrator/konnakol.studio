import { sleep } from '~/utils/common.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Fraction from './Fraction';
import Unit, { UnitKind } from './Unit';

export default class Roll implements Unit {
  kind = UnitKind.Roll

  constructor(public readonly fractions: Fraction[], public readonly index: number) {}

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm) / this.fractions.length

    for (const fraction of this.fractions) {
      await sleep(interval)
      yield [fraction]
    }
  }
}