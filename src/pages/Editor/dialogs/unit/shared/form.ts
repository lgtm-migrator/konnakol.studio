import { createEvent, createStore, sample } from 'effector';
import Unit, { WithFrequencies } from '~/entities/unit/model/Unit';
import { createForm } from '~/shared/form';
import { FormEntry } from '~/shared/form/types';
import { filter, map } from '~/shared/form/utils';
import { anyString, numerical } from '~/shared/form/validators';
import { FrequencyIndex } from '~/shared/types';
import { Frequency } from '~/types/fraction.types';

type FrequencyKey = `frequency${FrequencyIndex}`
type FlatFrequencies = Record<FrequencyKey, Frequency>
type UnitFormField = 'symbol' | FrequencyKey

export const makeFrequencyKey = (index: FrequencyIndex): FrequencyKey => `frequency${index}`

export function instantiateUnitForm() {
  const form = createForm<UnitFormField>({
    symbol: anyString,
    frequency0: numerical
  })

  const frequencies = {
    $store: form.$store.map(form => Object.entries(form)
      .filter(([key]) => key.startsWith('frequency'))
    ),
    $listening: createStore<FrequencyIndex | null>(null),
    add: createEvent(),
    update: createEvent<[FrequencyIndex, string]>(),
    remove: createEvent<FrequencyIndex>(),
    pitch: createEvent<FrequencyIndex>()
  }

  sample({
    clock: frequencies.add,
    source: frequencies.$store,
    fn: ({ length }) => ({ [makeFrequencyKey(length)]: '' }),
    target: form.update
  })

  sample({
    clock: frequencies.update,
    fn: ([index, value]) => ({ [makeFrequencyKey(index)]: value }),
    target: form.update
  })

  sample({
    clock: frequencies.remove,
    fn: (index) => ({ [makeFrequencyKey(index)]: undefined }),
    target: form.update
  })

  form.update.watch(console.log)

  sample({
    clock: frequencies.pitch,
    source: frequencies.$listening,
    fn: (prevIndex, newIndex) => prevIndex === newIndex ? null : newIndex,
    target: frequencies.$listening
  })

  return {
    ...form,
    frequencies
  }
}

export function flatFrequencies(frequencies: Frequency[]) {
  return frequencies.reduce<FlatFrequencies>(
    (acc, frequency, i) => ({ ...acc, [`frequency${i}`]: frequency }),
    {}
  )
}
