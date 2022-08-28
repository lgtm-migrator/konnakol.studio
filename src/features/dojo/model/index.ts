import { createEffect, createEvent, createStore, sample } from 'effector';
import { DEFAULT_BPM } from '~/constants';
import { Pitcher, pitchers } from '~/features/dojo/api/pitcher';
import { IWebAudioAPI } from '~/features/dojo/api/web-audio';
import { pitcherUpdated, playButtonClicked, promptBPMFx, stopButtonClicked } from '~/features/dojo/ui';
import Composition from '~/entities/composition/model';
import * as validation from '~/features/dojo/ui/validation';
import { FractionWithIndex } from '~/entities/fraction/model';
import { SullaLulla } from '~/data/compositions';
import { $webAudio, initializeWebAudioApiFx } from '../api';
import { interval, reset } from 'patronum';
import { Frequency } from '~/entities/unit/model';

interface CheckCompositionFxParams {
  composition: Composition
  pitcher: Pitcher,
  webAudio: IWebAudioAPI
}

interface DetectPitchInBackgroundFxParams {
  webAudio: IWebAudioAPI;
  pitcher: Pitcher;
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

export const fractionUpdated = createEvent<FractionWithIndex>()
export const tactUpdated = createEvent<number>()
export const incrementSuccessScore = createEvent()
export const incrementFailedScore = createEvent()
export const compositionSelected = createEvent<Composition>()
export const startCheckingFrequencyInBackground = createEvent();

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

export const detectPitchInBackgroundFx = createEffect(({
  webAudio,
  pitcher
}: DetectPitchInBackgroundFxParams) => pitcher.detect(webAudio.buffer))

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
  clock: initializeWebAudioApiFx.doneData,
  source: { composition: $composition, pitcher: $pitcher },
  filter: (sourceData): sourceData is { pitcher: Pitcher, composition: Composition } => !!sourceData.composition,
  fn: ({ composition, pitcher }, webAudio) => ({ composition: composition as Composition, webAudio, pitcher }),
  target: checkCompositionFx
})

sample({
  clock: stopButtonClicked,
  source: $composition,
  filter: Boolean,
  target: stopCheckingCompositionFx
})

sample({
  clock: playButtonClicked,
  source: $webAudio,
  target: initializeWebAudioApiFx
})

const { tick } = interval({
  start: initializeWebAudioApiFx.doneData,
  stop: checkCompositionFx.doneData,
  timeout: 1000 / 60,
  leading: true
})

sample({
  clock: initializeWebAudioApiFx.doneData,
  source: $webAudio,
  fn: (_, webAudio) => webAudio,
  target: $webAudio
})

sample({
  clock: tick,
  source: { webAudio: $webAudio, pitcher: $pitcher },
  filter: (params): params is DetectPitchInBackgroundFxParams => !!params.webAudio,
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
