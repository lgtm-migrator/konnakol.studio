import { createEffect, createEvent, createStore, sample } from 'effector';
import { DEFAULT_BPM } from '~/constants';
import { Pitcher, pitchers } from '~/features/dojo/api/pitcher';
import { IWebAudioAPI } from '~/features/dojo/api/web-audio';
import { listenButtonClicked, pitcherUpdated, playButtonClicked, promptBPMFx, stopButtonClicked } from '~/features/dojo/ui';
import Composition from '~/entities/composition/model';
import * as validation from '~/features/dojo/ui/validation';
import { FractionWithIndex } from '~/entities/fraction/model';
import { SullaLulla } from '~/data/compositions';
import { $webAudio, detectPitchInBackgroundFx, DetectPitchInBackgroundFxParams, initializeWebAudioApiFx } from '../api';
import { interval, reset } from 'patronum';
import { Frequency } from '~/entities/unit/model';

interface CheckCompositionFxParams {
  composition: Composition
  pitcher: Pitcher,
  webAudio: IWebAudioAPI
}

interface SubscribeToCompositionUpdatesFxParams {
  isPlaying: boolean;
  composition: Composition;
}

type CheckCompositionFx = (params: CheckCompositionFxParams) => void
type SubscribeToCompositionUpdatesFx = (params: SubscribeToCompositionUpdatesFxParams) => void

export const $bpm = createStore(DEFAULT_BPM)
export const $composition = createStore<Composition | null>(null)
export const $fraction = createStore<FractionWithIndex | null>(null)
export const $tact = createStore<number>(0)
export const $frequency = createStore<Frequency>(0)
export const $pitcher = createStore<Pitcher>(pitchers.ACF2PLUS)
export const $success = createStore<number>(0)
export const $failed = createStore<number>(0)
export const $isListening = $webAudio.map(Boolean)

export const fractionUpdated = createEvent<FractionWithIndex>()
export const tactUpdated = createEvent<number>()
export const incrementSuccessScore = createEvent()
export const incrementFailedScore = createEvent()
export const compositionSelected = createEvent<Composition>()
export const startCheckingFrequencyInBackground = createEvent()

export const checkCompositionFx = createEffect<CheckCompositionFx>(
  async ({ composition, pitcher, webAudio }) => {
    const detectPitch = () => pitcher.detect(webAudio.buffer)

    await composition.play(detectPitch)
  }
)

export const subscribeToCompositionUpdatesFx = createEffect<SubscribeToCompositionUpdatesFx>(
  ({ isPlaying, composition }) => {
    if (isPlaying) {
      composition?.subscribe(
        ({ fraction, isPlayedCorrectly, tactIndex }) => {
          fractionUpdated(fraction)
          tactUpdated(tactIndex)

          isPlayedCorrectly
            ? incrementSuccessScore()
            : incrementFailedScore()
        }
      )
    } else {
      composition?.unsubscribe()
    }
  }
)

export const stopCheckingCompositionFx = createEffect(
  (composition: Composition) => composition.stop()
)

reset({
  clock: stopCheckingCompositionFx.done,
  target: [$tact, $fraction, $frequency]
})

sample({
  clock: compositionSelected,
  target: $composition
})

sample({
  clock: checkCompositionFx.pending,
  source: $composition,
  filter: (composition): composition is Composition => !!composition,
  fn: (composition: Composition, isPlaying: boolean) => ({ composition, isPlaying }),
  target: subscribeToCompositionUpdatesFx
})

sample({
  clock: pitcherUpdated,
  fn: value => pitchers[validation.pitcher(value)],
  target: $pitcher
})

sample({
  clock: fractionUpdated,
  target: $fraction
})

sample({
  clock: tactUpdated,
  target: $tact
})

sample({
  clock: promptBPMFx.doneData,
  fn: validation.bpm,
  target: $bpm
})

sample({
  clock: listenButtonClicked,
  source: $webAudio,
  target: initializeWebAudioApiFx
})

sample({
  clock: stopButtonClicked,
  source: $composition,
  filter: Boolean,
  target: stopCheckingCompositionFx
})

const { tick } = interval({
  start: listenButtonClicked,
  timeout: 1000 / 60,
  leading: true
})

sample({
  clock: tick,
  source: { webAudio: $webAudio, pitcher: $pitcher },
  filter: (params): params is DetectPitchInBackgroundFxParams => Boolean(params.webAudio),
  fn: (params: DetectPitchInBackgroundFxParams) => params,
  target: detectPitchInBackgroundFx
})

sample({
  clock: detectPitchInBackgroundFx.doneData,
  filter: (frequency): frequency is Frequency => !!frequency,
  fn: (frequency: Frequency) => frequency,
  target: $frequency
})

// TODO: must be called from list of the compositions, initial is null
compositionSelected(new Composition(SullaLulla)) 
