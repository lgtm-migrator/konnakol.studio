import { FractionWithIndex, Pattern } from '~/entities/fraction/model'
import { Frequency } from '~/entities/unit/model'
import { sleep } from '~/utils/common.utils'
import { bpmToMilliseconds } from '~/utils/tempo.utils'
import { isFrequencyCorrect } from './utils'

type DetectPitchFn = () => Frequency | null
type CompositionTransition = AsyncGenerator<ICompositionState>
type UpdateHandler = (state: ICompositionState) => void

export interface ICompositionConfig {
  id: number
  name: string
  pattern: Pattern
  bpm: number
  size: number
}

export interface ICompositionState {
  tactIndex: number
  fraction: FractionWithIndex
  isPlayedCorrectly: boolean
}

export interface IComposition extends ICompositionConfig {
  play: (detectPitch: DetectPitchFn) => Promise<Composition>;
}

export default class Composition implements IComposition {
  public id: number
  public name: string
  public pattern: Pattern
  public bpm: number
  public size: number

  private iterator: CompositionTransition | null = null
  private listeners: UpdateHandler[] = []

  constructor(config: ICompositionConfig) {
    this.id = config.id
    this.name = config.name
    this.pattern = config.pattern
    this.bpm = config.bpm
    this.size = config.size
  }

  public async play(detectPitch: DetectPitchFn) {
    this.iterator = this.transition(detectPitch)

    for await (const state of this.iterator) {
      this.listeners.forEach(onUpdate => onUpdate?.(state))
    }

    this.iterator = null
    return this
  }

  public async stop() {
    await this.iterator?.return(null)
    this.iterator = null
    return this
  }

  public subscribe(listener: UpdateHandler) {
    this.listeners = [...this.listeners, listener]
    return this
  }

  public unsubscribe() {
    this.listeners = []
    return this
  }

  private async *transition(detectPitch: DetectPitchFn) {
    for (const [tactIndex, tact] of this.pattern.entries()) {
      for (const [fractionIndex, fraction] of tact.entries()) {
        await sleep(this.interval)

        const receivedFrequency = detectPitch()
        const expectedFrequency = fraction.unit?.frequency

        console.log({ receivedFrequency, expectedFrequency })

        const isPlayedCorrectly = expectedFrequency && receivedFrequency
          ? isFrequencyCorrect(expectedFrequency, receivedFrequency)
          : false

        yield this.constructCurrentState(
          tactIndex,
          { ...fraction, index: fractionIndex },
          isPlayedCorrectly
        )
      }
    }
  }

  private constructCurrentState = (
    tactIndex: number,
    fraction: FractionWithIndex,
    isPlayedCorrectly: boolean
  ): ICompositionState => ({
    tactIndex,
    fraction,
    isPlayedCorrectly
  })

  private get interval() {
    return bpmToMilliseconds(this.bpm)
  }
}