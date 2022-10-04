import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { isFrequencyCorrect } from '~/utils/frequency.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import { UnitKind } from './shared';
import Unit, { AnyUnit } from './Unit';

interface NoteConfig {
  frequencies: Frequency[]
  symbol: string
  color?: string
}

export const isNote = (unit: AnyUnit): unit is Note => unit instanceof Note

export default class Note implements Unit<null> {
  kind = UnitKind.Note
  children = null

  frequencies: Frequency[]
  symbol: string
  color?: string

  constructor(public readonly index: number, config: NoteConfig) {
    if (config.frequencies.length > 1) {
      throw new Error('Fraction can have one or no possible frequencies.')
    }

    this.frequencies = config.frequencies
    this.color = config.color
    this.symbol = config.symbol
  }

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm)
    await sleep(interval)
    yield this
  }

  check(receivedFrequency: Frequency) {
    const [expectedFrequency = null] = this.frequencies

    if (!expectedFrequency) {
      return true;
    }

    return isFrequencyCorrect(expectedFrequency, receivedFrequency)
  }
}
