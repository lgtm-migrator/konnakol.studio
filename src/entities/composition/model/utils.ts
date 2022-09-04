import { FREQUENCY_DEVIATION } from '~/constants';
import { Frequency } from '~/entities/unit/model';

export const isFrequencyCorrect = (expected: Frequency, received: Frequency) => {
  return (
    received <= expected + FREQUENCY_DEVIATION &&
    received >= expected - FREQUENCY_DEVIATION
  )
}