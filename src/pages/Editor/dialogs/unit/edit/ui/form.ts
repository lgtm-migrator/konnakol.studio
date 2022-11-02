import { createStore, sample } from 'effector';
import { $units } from '~/pages/editor/sidebar/model';
import { createForm } from '~/shared/form';
import { anyString, numerical } from '~/shared/form/validators';
import * as frequencies from './frequencies';
import { open } from './shared';

type FormField = 'symbol' | 'frequency'

export const { $store, update } = createForm<FormField>({
  symbol: anyString,
  frequency: numerical
})

export const $frequencies = $store.map(form => Object.entries(form)
  .filter(([key]) => key.startsWith('frequency')))


sample({
  clock: frequencies.add,
  source: { form: $store, frequencies: $frequencies },
  fn: ({ form, frequencies }) => ({ ...form, [`frequency${frequencies.length}`]: { value: '', error: '' } }),
  target: $store
})

sample({
  clock: open,
  source: $units,
  fn: (units, index) => {
    const unit = units.at(index)
    
    if (!unit) {
      throw new Error(`Unit with index ${index} was not found`)
    }

    return {
      symbol: unit.symbol,

    }
  },
  target: update
})
