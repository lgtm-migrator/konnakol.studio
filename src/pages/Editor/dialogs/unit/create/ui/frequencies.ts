import { createEvent } from 'effector'
import { FrequencyIndex } from '~/shared/types'

export const add = createEvent()
export const update = createEvent<[FrequencyIndex, string]>()
export const remove = createEvent<FrequencyIndex>()
export const pitch = createEvent<FrequencyIndex>()

