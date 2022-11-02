import { createEvent, sample } from 'effector';
import Note from '~/entities/unit/model/Note';
import { $units } from '~/pages/editor/sidebar/model';
import { createForm } from '~/shared/form';
import { anyString, numerical } from '~/shared/form/validators';
import * as frequencies from './frequencies';

type FormField = 'symbol' | `frequency${number}`

export const { $store, update, reset } = createForm<FormField>({
  symbol: anyString,
  frequency0: numerical
})

export const $frequencies = $store.map(form => Object.entries(form)
  .filter(([key]) => key.startsWith('frequency')))

export const save = createEvent();

sample({
  clock: frequencies.add,
  source: { form: $store, frequencies: $frequencies },
  fn: ({ form, frequencies }) => ({
    ...form,
    [`frequency${frequencies.length}`]: { value: '', error: '' }
  }),
  target: $store
})

sample({
  clock: frequencies.update,
  fn: ([index, value]) => ({ [`frequency${index}`]: value }),
  target: update
})

sample({
  clock: save,
  source: { form: $store, units: $units, frequencies: $frequencies },
  fn: ({ form, units, frequencies }) => [
    ...units,
    new Note({
      frequencies: frequencies.map(([_, { value }]) => Number(value)),
      symbol: form.symbol.value
    })
  ],
  target: $units
})

sample({
  clock: save,
  target: reset
})
