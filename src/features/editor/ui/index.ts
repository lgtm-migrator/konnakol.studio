import { createEvent, createStore, sample } from 'effector';
import { UnitType } from '~/entities/unit/model';

export type ToolbarUnitIndex = number

export const $isAddUnitDialogOpened = createStore(false)
export const $isEditUnitDialogOpened = createStore(false)

export const addUnitDialogOpened = createEvent()
export const addUnitDialogClosed = createEvent()
export const editUnitDialogOpened = createEvent<ToolbarUnitIndex>()
export const editUnitDialogClosed = createEvent()
export const newUnitTypeSelected = createEvent<UnitType>()
export const newUnitFrequencyChanged = createEvent<string>()
export const newUnitSymbolChanged = createEvent<string>()
export const unitTypeSelected = createEvent<UnitType>()
export const unitFrequencyChanged = createEvent<string>()
export const unitSymbolChanged = createEvent<string>()
export const editUnitButtonClicked = createEvent()
export const createUnitButtonClicked = createEvent()

sample({
  clock: addUnitDialogOpened,
  fn: () => true,
  target: $isAddUnitDialogOpened
})

sample({
  clock: addUnitDialogClosed,
  fn: () => false,
  target: $isAddUnitDialogOpened
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
