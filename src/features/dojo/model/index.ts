import { createEffect, createStore, sample } from 'effector';
import { DEFAULT_BPM } from '~/constants';
import { Pitcher, pitchers } from '~/features/dojo/api/pitcher';
import { pitcherUpdated } from '~/features/dojo/ui';
import Composition from '~/entities/composition/model';
import * as validation from '~/features/dojo/ui/validation';

export const $bpm = createStore(DEFAULT_BPM)
export const $composition = createStore<Composition | null>(null)
export const $fraction = createStore<number | null>(null)
export const $tact = createStore<number | null>(null)
export const $frequency = createStore<number>(0)
export const $pitcher = createStore<Pitcher>(pitchers.ACF2PLUS)
export const $success = createStore<number>(0)
export const $failed = createStore<number>(0)

export const checkCompositionFx = createEffect(
  (composition: Composition, pitcher: Pitcher) => composition.check(pitcher)
)

sample({
  clock: pitcherUpdated,
  fn: value => pitchers[validation.pitcher(value)],
  target: $pitcher
})
