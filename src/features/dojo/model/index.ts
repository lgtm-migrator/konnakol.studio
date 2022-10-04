import { combine, createEffect, createEvent, createStore, sample, UnitValue } from 'effector';
import { DEFAULT_BPM } from '~/constants';
import { Pitcher, pitchers } from '~/features/dojo/api/pitcher';
import { isRepeatingCheckboxChanged, listenButtonClicked, pitcherUpdated, playButtonClicked, promptBPMFx, stopButtonClicked } from '~/features/dojo/ui';
import Composition from '~/entities/composition/model';
import * as validation from '~/features/dojo/ui/validation';
import { $webAudio, detectPitchInBackgroundFx, DetectPitchInBackgroundFxParams, initializeWebAudioApiFx } from '../api';
import { condition, interval, reset, spread } from 'patronum';
import { $score, Correctness, ScoreSource, ScoreString, updateScore } from './score';
import { NonNullableStructure } from '~/utils/types.utils';
import { Frequency } from '~/types/fraction.types';
import Tact from '~/entities/composition/model/Tact';
import { AnyUnit } from '~/entities/unit/model/Unit';
import RollChordTest from '~/data/compositions/roll-chord-test';

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

export const subscribeCompositionUpdatesFx = createEffect(
  (composition: Composition) => composition.subscribe(compositionUpdated)
)

export const unsubscribeCompositionUpdatesFx = createEffect(
  (composition: Composition) => composition.unsubscribe()
)

export const playCompositionFx = createEffect<CheckCompositionFx>(
  ({ composition, bpm }) => composition.play(bpm)
)

export const stopCompositionFx = createEffect(
  (composition: Composition) => composition.stop()
)

export const $bpm = createStore(DEFAULT_BPM)
export const $composition = createStore<Composition | null>(null)
export const $unit = createStore<AnyUnit | null>(null)
export const $tact = createStore<Tact | null>(null)
export const $frequency = createStore<Frequency>(0)
export const $pitcher = createStore<Pitcher>(pitchers.ACF2PLUS)
export const $isRepeating = createStore(false)
export const $loopIndex = createStore(0);
export const $isListening = $webAudio.map(Boolean)
export const $scoreSource = combine({
  frequency: $frequency,
  tact: $tact,
  loopIndex: $loopIndex,
  unit: $unit,
})
export const $isPlaying = playCompositionFx.pending

export const startCheckingFrequencyInBackground = createEvent()
export const unitUpdated = createEvent<AnyUnit>()
export const tactUpdated = createEvent<Tact>()
export const loopIncremented = createEvent()
export const compositionSelected = createEvent<Composition>()
export const compositionUpdated = spread({ targets: { unit: unitUpdated, tact: tactUpdated } })

unitUpdated.watch(unit => console.log({ unit }))
tactUpdated.watch(tact => console.log({ tact }))
compositionUpdated.watch(state => console.log({ state }))

reset({
  clock: playCompositionFx.done,
  target: [$tact, $unit, $frequency, $score]
})

sample({
  clock: compositionSelected,
  target: $composition
})

sample({
  clock: isRepeatingCheckboxChanged,
  target: $isRepeating
})

condition({
  source: $composition,
  if: $isPlaying,
  then: subscribeCompositionUpdatesFx,
  else: unsubscribeCompositionUpdatesFx
})

sample({
  clock: loopIncremented,
  source: $loopIndex,
  fn: (i) => i + 1,
  target: $loopIndex
})

sample({
  clock: playButtonClicked,
  source: { composition: $composition, bpm: $bpm },
  filter: (sourceData: CheckCompositionSource): sourceData is CheckCompositionParams => Boolean(sourceData.composition),
  target: playCompositionFx
})

sample({
  clock: playCompositionFx.done,
  source: { isRepeating: $isRepeating, composition: $composition, bpm: $bpm },
  filter: (sourceData: RepeatCompositionSource): sourceData is RepeatCompositionParams => Boolean(
    sourceData.isRepeating && sourceData.composition
  ),
  fn: ({ composition, bpm }: RepeatCompositionParams) => ({ composition, bpm }),
  target: [playCompositionFx, loopIncremented]
})

sample({
  clock: pitcherUpdated,
  fn: value => pitchers[validation.pitcher(value)],
  target: $pitcher
})

sample({
  clock: unitUpdated,
  target: $unit
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
  target: stopCompositionFx
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
  filter: (source: UnitValue<typeof $scoreSource>): source is ScoreSource => !!source.unit,
  fn: ({ unit, frequency, tact, loopIndex }): [ScoreString, Correctness] => {

    const status = unit.check(frequency)
      ? 'success'
      : 'failed'

    return [`${loopIndex}:${tact.index}:${unit.index}`, status];
  },
  target: updateScore
})

// TODO: must be called from list of the compositions, initial is null
compositionSelected(new Composition(RollChordTest)) 
