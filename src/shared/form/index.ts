import { createEvent, createStore } from 'effector';
import { Field, Validator, FormStore, FormValues } from './types';
import { filter } from './utils';
import validate from './validators';

export function createForm<F extends Field = Field>(
  schema: Record<F, Validator>
) {
  type Updates = Partial<FormValues<F>>

  const update = createEvent<Updates>()
  const $store = createStore<FormStore<F>>(
    Object.fromEntries(
      Object.entries(schema).map(([field]) => [field, { value: '', error: '' }])
    ) as FormStore<F>
  )

  $store.on(update, (form, updates) => {
    return filter(
      {
        ...form,
        ...validate(updates, schema)
      },
      (_, entry) => entry !== undefined
    )
  })

  return {
    $store,
    update,
  }
}
