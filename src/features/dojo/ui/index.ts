import { createEffect, createEvent, sample } from 'effector'

export const promptBPMFx = createEffect(() => prompt('Enter BPM (pass only digits here)'))

export const playButtonClicked = createEvent()
export const stopButtonClicked = createEvent()
export const listenButtonClicked = createEvent()
export const enterBPMButtonClicked = createEvent()
export const pitcherUpdated = createEvent<string>()
export const isRepeatingCheckboxChanged = createEvent<boolean>()

sample({
  clock: enterBPMButtonClicked,
  target: promptBPMFx
})
