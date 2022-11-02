import { createStore } from 'effector';
import { FrequencyIndex } from '~/shared/types';
import { pitch } from '../ui/frequencies';

export const $pitchingFrequencyIndex = createStore<FrequencyIndex | null>(null)

$pitchingFrequencyIndex
  .on(pitch, (prev, index) => prev === index ? null : index)



