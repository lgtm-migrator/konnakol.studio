import { createEvent, createStore, sample } from 'effector';
import { UnitType } from '~/entities/unit/model';

export const $isAddUnitDialogOpened = createStore(false)

export const addUnitDialogOpened = createEvent()
export const addUnitDialogClosed = createEvent()
export const newUnitTypeSelected = createEvent<UnitType>()
export const newUnitFrequencyChanged = createEvent<string>()
export const newUnitSymbolChanged = createEvent<string>()
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
