import { createEffect, createEvent } from 'effector'

export const promptBPMFx = createEffect(() => prompt('Enter BPM'))

export const playButtonClicked = createEvent()
export const stopButtonClicked = createEvent()
export const pitcherUpdated = createEvent<string>()
