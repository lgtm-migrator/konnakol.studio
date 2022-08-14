import { PreparedPattern, prepareTact, RawPattern } from '~/entities/fraction/model'
import { Frequency } from '~/entities/unit/model'
import { isFrequencyCorrect } from './utils'

type DetectPitchFn = () => Promise<Frequency>

export interface ICompositionConfig {
  id: number
  name: string
  pattern: RawPattern
  tempo: number
  size: number
}

export interface ICompositionState {
  fraction: number
  isPlayedCorrectly: boolean
}

export interface IComposition extends ICompositionConfig {
  check: (detectPitch: DetectPitchFn) => AsyncGenerator<ICompositionState>
}

export default class Composition implements IComposition {
  id: number
  name: string
  pattern: PreparedPattern
  tempo: number
  size: number

  constructor(config: IComposition) {
    this.id = config.id
    this.name = config.name
    this.pattern = config.pattern.map(prepareTact)
    this.tempo = config.tempo
    this.size = config.size
  }

  async *check(detectPitch: DetectPitchFn) {
    const pattern = this.pattern

    for (const tact of pattern) {
      for (const fraction of tact) {
        if (!fraction.unit?.frequency) {
          yield { fraction: fraction.index, isPlayedCorrectly: true }
          continue
        }

        const frequency = await detectPitch()
        yield {
          fraction: fraction.index,
          isPlayedCorrectly: isFrequencyCorrect(fraction.unit.frequency, frequency)
        }
      }
    }
  }
}