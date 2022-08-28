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
import { interval } from 'patronum';

interface CheckCompositionFxParams {
  composition: Composition
  pitcher: Pitcher,
  webAudio: IWebAudioAPI
}

interface DetectPitchInBackgroundFxParams {
  webAudio: IWebAudioAPI;
  pitcher: Pitcher;
}

type CheckCompositionFx = (params: CheckCompositionFxParams) => void

export const $bpm = createStore(DEFAULT_BPM)
export const $composition = createStore<Composition | null>(null)
export const $fraction = createStore<FractionWithIndex | null>(null)
export const $tact = createStore<number>(0)
export const $frequency = createStore<number>(0)
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
  async ({ composition, pitcher }) => {
    // TODO: learn how not to call one effect inside another
    const webAudio = await initializeWebAudioApiFx();

    const detectPitch = () => pitcher.detect(webAudio.buffer).frequency

    await composition.play(detectPitch, ({ fraction, isPlayedCorrectly, tactIndex }) => {
      fractionUpdated(fraction)
      tactUpdated(tactIndex)

      isPlayedCorrectly
        ? incrementSuccessScore()
        : incrementFailedScore()
    })
  }
)

export const stopCheckingCompositionFx = createEffect(
  (composition: Composition) => composition.stop()
)

export const detectPitchInBackgroundFx = createEffect(async ({
  webAudio,
  pitcher
}: DetectPitchInBackgroundFxParams) => {
  return pitcher.detect(webAudio.buffer);
})

$tact.reset(stopCheckingCompositionFx.done)
$fraction.reset(stopCheckingCompositionFx.done)

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
  clock: playButtonClicked,
  source: { composition: $composition, pitcher: $pitcher, webAudio: $webAudio },
  filter: (params): params is CheckCompositionFxParams => Boolean(
    params.webAudio && params.composition
  ),
  target: checkCompositionFx
})

sample({
  clock: stopButtonClicked,
  source: { composition: $composition, isPlaying: checkCompositionFx.pending },
  filter: ({ isPlaying, composition }) => isPlaying && Boolean(composition),
  fn: ({ composition }) => {
    if (!composition) {
      throw new Error('Composition is not selected.')
    }

    return composition
  },
  target: stopCheckingCompositionFx
})

sample({
  clock: compositionSelected,
  target: $composition
})

const { tick } = interval({
  timeout: 1000 / 60,
  start: playButtonClicked,
  stop: stopButtonClicked,
  leading: true
})

// TODO: must be called from list of the compositions, initial is null
compositionSelected(new Composition(SullaLulla)) 
