import { createEvent, createStore, sample } from 'effector';
import { UnitType } from '~/entities/unit/model';

export type ToolbarUnitIndex = number
export type FrequencyIndex = number

export const $isCreateUnitDialogOpened = createStore(false)
export const $isEditUnitDialogOpened = createStore(false)

export const createUnitDialogOpened = createEvent()
export const createUnitDialogClosed = createEvent()
export const editUnitDialogOpened = createEvent<ToolbarUnitIndex>()
export const editUnitDialogClosed = createEvent()
export const newUnitTypeSelected = createEvent<UnitType>()
export const newUnitFrequencyChanged = createEvent<[FrequencyIndex, string]>()
export const newUnitSymbolChanged = createEvent<string>()
export const editableUnitTypeSelected = createEvent<UnitType>()
export const editableUnitFrequencyChanged = createEvent<[FrequencyIndex, string]>()
export const editableUnitSymbolChanged = createEvent<string>()
export const editUnitButtonClicked = createEvent()
export const createUnitButtonClicked = createEvent()

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
  clock: editUnitDialogOpened,
  fn: () => true,
  target: $isEditUnitDialogOpened
})

sample({
  clock: editUnitDialogClosed,
  fn: () => false,
  target: $isEditUnitDialogOpened
})
