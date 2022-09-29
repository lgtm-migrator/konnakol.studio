import { combine, createEffect, createEvent, createStore, sample, UnitValue } from 'effector';
import { DEFAULT_BPM } from '~/constants';
import { Pitcher, pitchers } from '~/features/dojo/api/pitcher';
import { isRepeatingCheckboxChanged, listenButtonClicked, pitcherUpdated, playButtonClicked, promptBPMFx, stopButtonClicked } from '~/features/dojo/ui';
import Composition from '~/entities/composition/model';
import * as validation from '~/features/dojo/ui/validation';
import { Osherov1 } from '~/data/compositions';
import { $webAudio, detectPitchInBackgroundFx, DetectPitchInBackgroundFxParams, initializeWebAudioApiFx } from '../api';
import { interval, reset } from 'patronum';
import { $score, Correctness, ScoreSource, ScoreString, updateScore } from './score';
import { areFrequenciesCorrect, isFrequencyCorrect } from '~/utils/frequency.utils';
import { NonNullableStructure } from '~/utils/types.utils';
import { Frequency } from '~/types/fraction.types';
import Fraction from '~/entities/unit/model/Fraction';

interface SubscribeToCompositionUpdatesFxParams {
  isPlaying: boolean;
  composition: Composition;
}

interface RepeatCompositionSource {
  composition: Composition | null
  isRepeating: boolean
  bpm: number
}

interface CheckCompositionSource {
  composition: Composition | null
  bpm: number
}

type CheckCompositionParams = NonNullableStructure<CheckCompositionSource>
type RepeatCompositionParams = NonNullableStructure<RepeatCompositionSource>

type CheckCompositionFx = (params: CheckCompositionParams) => void
type SubscribeToCompositionUpdatesFx = (params: SubscribeToCompositionUpdatesFxParams) => void

export const $bpm = createStore(DEFAULT_BPM)
export const $composition = createStore<Composition | null>(null)
export const $fraction = createStore<Fraction | null>(null)
export const $tactIndex = createStore<number>(0)
export const $frequency = createStore<Frequency>(0)
export const $pitcher = createStore<Pitcher>(pitchers.ACF2PLUS)
export const $isRepeating = createStore(true)
export const $loopIndex = createStore(0);
export const $isListening = $webAudio.map(Boolean)
export const $scoreSource = combine({
  frequency: $frequency,
  tactIndex: $tactIndex,
  loopIndex: $loopIndex,
  fraction: $fraction,
})

export const fractionUpdated = createEvent<Fraction>()
export const tactUpdated = createEvent<number>()
export const compositionSelected = createEvent<Composition>()
export const startCheckingFrequencyInBackground = createEvent()
export const loopIncremented = createEvent()

export const checkCompositionFx = createEffect<CheckCompositionFx>(
  ({ composition, bpm }) => composition.play(bpm)
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
  clock: isRepeatingCheckboxChanged,
  target: $isRepeating
})

sample({
  clock: loopIncremented,
  source: $loopIndex,
  fn: (i) => i + 1,
  target: $loopIndex
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
  source: { composition: $composition, bpm: $bpm },
  filter: (sourceData: CheckCompositionSource): sourceData is CheckCompositionParams => Boolean(sourceData.composition),
  target: checkCompositionFx
})

sample({
  clock: checkCompositionFx.done,
  source: { isRepeating: $isRepeating, composition: $composition, bpm: $bpm },
  filter: (sourceData: RepeatCompositionSource): sourceData is RepeatCompositionParams => Boolean(
    sourceData.isRepeating && sourceData.composition
  ),
  fn: ({ composition, bpm }: RepeatCompositionParams) => ({ composition, bpm }),
  target: [checkCompositionFx, loopIncremented]
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
  filter: (source: UnitValue<typeof $scoreSource>): source is ScoreSource => !!source.fraction,
  fn: ({ fraction, frequency, tactIndex, loopIndex }): [ScoreString, Correctness] => {
    const status = areFrequenciesCorrect(fraction.possibleFrequencies, frequency)
      ? 'success'
      : 'failed'

    return [`${loopIndex}:${tactIndex}:${fraction.index}`, status];
  },
  target: updateScore
})

// TODO: must be called from list of the compositions, initial is null
compositionSelected(new Composition(Osherov1)) 
