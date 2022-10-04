import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { areFrequenciesCorrect } from '~/utils/frequency.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Note from './Note';
import { UnitKind } from './shared';
import Unit, { AnyUnit } from './Unit';

export const isRoll = (unit: AnyUnit): unit is Roll => unit instanceof Roll

export default class Roll implements Unit<Note[]> {
  public readonly kind = UnitKind.Roll
  public currentFraction: Note | null = null

  constructor(public readonly index: number, public readonly children: Note[]) { }

  get symbol() {
    return `[${this.children.map(({ symbol }) => symbol).join(',')}]`
  }

  async play(bpm: number) {
    const interval = bpmToMilliseconds(bpm) / this.children.length

    for (const fraction of this.children) {
      this.currentFraction = fraction
      await sleep(interval)
    }

    return this
  }

  check(receivedFrequency: Frequency) {
    if (!this.currentFraction) {
      throw new Error('Roll is not being played now.')
    }

    return areFrequenciesCorrect(this.currentFraction.frequencies, receivedFrequency)
  }
}