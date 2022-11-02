import { createEvent, createStore, sample } from 'effector'
import { not, empty, condition } from 'patronum'
import { UnitType } from '~/entities/unit/model'
import { $webAudio, requestWebAudioAPI, startListeningMicro, stopListeningMicro, $frequency } from '~/shared/pitch'
import { newUnitFrequencyChanged } from './create-unit-form'
import { FrequencyIndex, ToolbarUnitIndex } from './shared'

export const editUnitDialogOpened = createEvent<ToolbarUnitIndex>()
export const editUnitDialogClosed = createEvent()

// TODO: refactor naming
export const editableUnitTypeSelected = createEvent<UnitType>()
export const editableUnitFrequencyChanged = createEvent<[FrequencyIndex, string]>()
export const editableUnitFrequencyAdded = createEvent()
export const editableUnitFrequencyRemoved = createEvent<FrequencyIndex>()
export const editableUnitFrequencyPitched = createEvent<FrequencyIndex>()
export const editableUnitSymbolChanged = createEvent<string>()
export const editUnitButtonClicked = createEvent()

export const $isEditUnitDialogOpened = createStore(false)
export const $pitchingFrequencyIndex = createStore<FrequencyIndex | null>(null)
export const $isListening = not(empty($pitchingFrequencyIndex));

sample({
  clock: editUnitDialogOpened,
  fn: () => true,
  target: $isEditUnitDialogOpened
})

sample({
  clock: editUnitDialogClosed,
  fn: () => false,
  target: $isEditUnitDialogOpened
})

sample({
  clock: editableUnitFrequencyPitched,
  source: $pitchingFrequencyIndex,
  fn: (source, clock) => source === clock ? null : clock,
  target: $pitchingFrequencyIndex
})

sample({
  clock: editableUnitFrequencyPitched,
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
