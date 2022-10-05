import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { areFrequenciesCorrect } from '~/utils/frequency.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Note from './Note';
import { UnitKind } from './shared';
import Unit, { CompositeUnit, SingleUnit } from './Unit';

export const isRoll = (unit: Unit): unit is Roll => unit instanceof Roll

export default class Roll implements CompositeUnit<SingleUnit[]> {
  public readonly kind = UnitKind.Roll
  public currentFraction: SingleUnit | null = null

  constructor(public readonly index: number, public readonly children: SingleUnit[]) { }

  get symbol() {
    return `[${this.children.map(({ symbol }) => symbol).join(',')}]`
  }

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm) / this.children.length
    for (const currentFraction of this.children) {
      this.currentFraction = currentFraction
      yield this.currentFraction
      await sleep(interval)
    }
  }

  check(receivedFrequency: Frequency) {
    if (!this.currentFraction) {
      throw new Error('Roll is not being played now.')
    }

    return areFrequenciesCorrect(this.currentFraction.frequencies, receivedFrequency)
  }
}