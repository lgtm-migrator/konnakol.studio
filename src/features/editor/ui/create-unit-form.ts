import { createEvent, createStore, sample } from 'effector'
import { condition, empty, not } from 'patronum'
import { UnitType } from '~/entities/unit/model'
import { $frequency, $webAudio, requestWebAudioAPI, startListeningMicro, stopListeningMicro } from '~/shared/pitch'
import { FrequencyIndex } from './shared'

export const $pitchingFrequencyIndex = createStore<FrequencyIndex | null>(null)
export const $isListening = not(empty($pitchingFrequencyIndex));

export const createUnitDialogOpened = createEvent()
export const createUnitDialogClosed = createEvent()

export const newUnitTypeSelected = createEvent<UnitType>()
export const newUnitFrequencyChanged = createEvent<[FrequencyIndex, string]>()
export const newUnitSymbolChanged = createEvent<string>()
export const createUnitButtonClicked = createEvent()
export const addUnitFrequencyButtonClicked = createEvent()
export const removeUnitFrequencyButtonClicked = createEvent<FrequencyIndex>()
export const pitchUnitFrequencyButtonClicked = createEvent<FrequencyIndex>()

export const $isCreateUnitDialogOpened = createStore(false)

sample({
  clock: createUnitDialogOpened,
  fn: () => true,
  target: $isCreateUnitDialogOpened
})

sample({
  clock: createUnitDialogClosed,
  fn: () => false,
  target: $isCreateUnitDialogOpened
})

sample({
  clock: pitchUnitFrequencyButtonClicked,
  source: $pitchingFrequencyIndex,
  fn: (source, clock) => source === clock ? null : clock,
  target: $pitchingFrequencyIndex
})

sample({
  clock: pitchUnitFrequencyButtonClicked,
  filter: empty($webAudio),
  target: requestWebAudioAPI
})

condition({
  source: $pitchingFrequencyIndex,
  if: $isListening,
  then: startListeningMicro,
  else: stopListeningMicro
})

sample({
  clock: $frequency,
  source: $pitchingFrequencyIndex,
  filter: (index: number | null): index is number => index !== null,
  fn: (index, frequency) => [index, frequency.toFixed(2)] as const,
  target: newUnitFrequencyChanged
})

