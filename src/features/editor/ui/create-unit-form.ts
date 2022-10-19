import { createEvent, createStore, sample } from 'effector'
import { UnitType } from '~/entities/unit/model'
import { FrequencyIndex } from './shared'

export const createUnitDialogOpened = createEvent()
export const createUnitDialogClosed = createEvent()

export const newUnitTypeSelected = createEvent<UnitType>()
export const newUnitFrequencyChanged = createEvent<[FrequencyIndex, string]>()
export const newUnitSymbolChanged = createEvent<string>()

export const createUnitButtonClicked = createEvent()

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

