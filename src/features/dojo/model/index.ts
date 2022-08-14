import { createEvent, createStore, sample } from 'effector';
import { DEFAULT_BPM } from '~/constants';
import { Composition } from '~/entities/composition/model';
import { Pitcher, pitchers } from '~/features/dojo/api/pitcher';
import * as validation from '~/features/dojo/ui/validation';

export const $bpm = createStore(DEFAULT_BPM)
export const $composition = createStore<Composition | null>(null)
export const $fraction = createStore<number | null>(null)
export const $tact = createStore<number | null>(null)
export const $frequency = createStore<number | null>(null)
export const $pitcher = createStore<Pitcher>(pitchers.ACF2PLUS)
export const $success = createStore<number>(0)
export const $failed = createStore<number>(0)

export const pitcherUpdated = createEvent<string>()

sample({
  clock: pitcherUpdated,
  fn: value => pitchers[validation.pitcher(value)],
  target: $pitcher
})
