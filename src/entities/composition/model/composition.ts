import { Fraction } from '~/entities/fraction/model'
import { Frequency } from '~/entities/unit/model'

type Pattern = Fraction[][]
type DetectPitchFn = () => Promise<Frequency>

export interface ICompositionConfig {
  id: number
  name: string
  pattern: Pattern
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
  pattern: Pattern
  tempo: number
  size: number

  constructor(config: IComposition) {
    this.id = config.id
    this.name = config.name
    this.pattern = config.pattern
    this.tempo = config.tempo
    this.size = config.size
  }

  async *check(detectPitch: DetectPitchFn) {
    const pattern = this.pattern

    for (const tact of pattern) {
      for (const fraction of tact) {
        const frequency = await detectPitch()
        yield { fraction: fraction.index, isPlayedCorrectly: false }
      }
    }
  }
}