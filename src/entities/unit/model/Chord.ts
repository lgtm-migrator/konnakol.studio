import { sleep } from '~/utils/common.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Fraction from './Fraction';
import Unit, { UnitKind } from './Unit';

export default class Chord implements Unit {
  kind = UnitKind.Chord;

  constructor(public readonly fractions: Fraction[], public readonly index: number) { }

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm)
    await sleep(interval)
    yield this.fractions
  }
}