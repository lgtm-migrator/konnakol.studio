import { createEvent, createStore, sample } from 'effector'
import { UnitType } from '~/entities/unit/model'
import { FrequencyIndex, ToolbarUnitIndex } from './shared'

export const editUnitDialogOpened = createEvent<ToolbarUnitIndex>()
export const editUnitDialogClosed = createEvent()

export const editableUnitTypeSelected = createEvent<UnitType>()
export const editableUnitFrequencyChanged = createEvent<[FrequencyIndex, number]>()
export const editableUnitSymbolChanged = createEvent<string>()
export const editUnitButtonClicked = createEvent()

export const $isEditUnitDialogOpened = createStore(false)

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