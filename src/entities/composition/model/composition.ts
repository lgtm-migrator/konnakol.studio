import { AnyUnit } from '~/entities/unit/model/Unit'
import { sleep } from '~/utils/common.utils'
import { bpmToMilliseconds } from '~/utils/tempo.utils'
import Tact from './Tact'

type CompositionTransition = AsyncGenerator<ICompositionState>
type UpdateHandler = (state: ICompositionState) => void
type Pattern = Tact[]

export interface ICompositionConfig {
  id: number
  name: string
  pattern: Pattern
  bpm: number
  size: number
}

export interface ICompositionState {
  tact: Tact,
  unit: AnyUnit
}

export interface IComposition extends ICompositionConfig {
  play: (bpm?: number) => Promise<Composition>;
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

  public async play(bpm: number = this.bpm) {
    this.iterator = this.transition(bpm)

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

  private async *transition(bpm: number): CompositionTransition {
    for (const tact of this.pattern) {
      for (const unit of tact.units) {
        await sleep(bpmToMilliseconds(bpm))
        yield {
          tact,
          unit
        }
      }
    }
  }
}