import { createEffect, createEvent, sample } from 'effector'
import { $bpm } from '~/features/dojo/model'
import { initializeWebAudioApiFx } from '~/features/dojo/api'
import * as validation from '~/features/dojo/ui/validation'

const promptBPMFx = createEffect(() => prompt('Enter BPM'))

export const dojoUIMounted = createEvent()

sample({
  clock: promptBPMFx.doneData,
  fn: validation.bpm,
  target: $bpm
})

sample({
  clock: dojoUIMounted,
  target: [initializeWebAudioApiFx]
})
