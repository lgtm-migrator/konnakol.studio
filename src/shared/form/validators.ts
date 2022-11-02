import { Field, FormStore, FormValues, Validator, Value } from './types'

export const anyString = () => ''
export const numerical = (value: Value) => /\d/g.test(value) ? '' : 'Must be a number'

export default function validate<F extends Field>(
  values: Partial<Record<F, string>>,
  schema: Record<F, Validator>
) {
  const validatedValues: Partial<FormStore<F>> = {}

  for (const key in values) {
    const value = values?.[key]

    if (value) {
      const error = schema?.[key]?.(value) ?? ''
      validatedValues[key] = { error, value }
    }
  }

  return validatedValues
}
