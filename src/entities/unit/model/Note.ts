import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { isFrequencyCorrect } from '~/utils/frequency.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Unit, { Renderable, SingleUnit, UnitKind, UnitType, WithFrequencies } from './Unit';

interface NoteConfig {
  frequencies: Frequency[]
  symbol: string
  color?: string
}

export const isNote = (unit: Unit): unit is Note => unit instanceof Note

export default class Note implements SingleUnit, Renderable, WithFrequencies {
  kind: UnitKind.Single = UnitKind.Single
  type: UnitType.Note = UnitType.Note

  frequencies: Frequency[]
  symbol: string
  color: string

  constructor(config: NoteConfig) {
    if (config.frequencies.length > 1) {
      throw new Error('Fraction can have one or no possible frequencies.')
    }

    this.frequencies = config.frequencies
    this.color = config.color ?? 'black'
    this.symbol = config.symbol
  }

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm)
    yield this
    await sleep(interval)
  }

  check(receivedFrequency: Frequency) {
    const [expectedFrequency = null] = this.frequencies

    if (!expectedFrequency) {
      return true;
    }

    return isFrequencyCorrect(expectedFrequency, receivedFrequency)
  }
}
