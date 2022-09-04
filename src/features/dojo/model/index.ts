import { combine, createEffect, createEvent, createStore, sample, Store, UnitValue } from 'effector';
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
import { $score, Correctness, ScoreSource, ScoreString, updateScore } from './score';
import { isFrequencyCorrect } from '~/utils/frequency.utils';

interface CheckCompositionFxSource {
  composition: Composition | null
  pitcher: Pitcher
  webAudio: IWebAudioAPI | null
}

interface SubscribeToCompositionUpdatesFxParams {
  isPlaying: boolean;
  composition: Composition;
}



type CheckCompositionFx = (composition: Composition) => void
type SubscribeToCompositionUpdatesFx = (params: SubscribeToCompositionUpdatesFxParams) => void

export const $bpm = createStore(DEFAULT_BPM)
export const $composition = createStore<Composition | null>(null)
export const $fraction = createStore<FractionWithIndex | null>(null)
export const $tactIndex = createStore<number>(0)
export const $frequency = createStore<Frequency>(0)
export const $pitcher = createStore<Pitcher>(pitchers.ACF2PLUS)
export const $isListening = $webAudio.map(Boolean)
export const $scoreSource = combine({
  frequency: $frequency,
  tactIndex: $tactIndex,
  fraction: $fraction,
})

export const fractionUpdated = createEvent<FractionWithIndex>()
export const tactUpdated = createEvent<number>()
export const compositionSelected = createEvent<Composition>()
export const startCheckingFrequencyInBackground = createEvent()

export const checkCompositionFx = createEffect<CheckCompositionFx>(
  (composition: Composition) => composition.play()
)

export const subscribeToCompositionUpdatesFx = createEffect<SubscribeToCompositionUpdatesFx>(
  ({ isPlaying, composition }) => {
    if (isPlaying) {
      composition?.subscribe(
        ({ fraction, tactIndex }) => {
          fractionUpdated(fraction)
          tactUpdated(tactIndex)
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
  target: [$tactIndex, $fraction, $frequency, $score]
})

sample({
  clock: compositionSelected,
  target: $composition
})

sample({
  clock: checkCompositionFx.pending,
  source: $composition,
  filter: (composition: Composition | null): composition is Composition => !!composition,
  fn: (composition, isPlaying) => ({ composition, isPlaying }),
  target: subscribeToCompositionUpdatesFx
})

sample({
  clock: playButtonClicked,
  source: $composition,
  filter: Boolean,
  target: checkCompositionFx
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
  target: $tactIndex
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

sample({
  clock: $scoreSource,
  filter: (source: UnitValue<typeof $scoreSource>): source is ScoreSource => !!source?.fraction?.unit,
  fn: ({ fraction, frequency, tactIndex }): [ScoreString, Correctness] => {
    const status = isFrequencyCorrect(fraction.unit.frequency, frequency)
      ? 'success'
      : 'failed'

    return [`${tactIndex}:${fraction.index}`, status];
  },
  target: updateScore
})

// TODO: must be called from list of the compositions, initial is null
compositionSelected(new Composition(SullaLulla)) 
