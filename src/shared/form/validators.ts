import { Field, FormStore, Validator, Value } from './types'

export const anyString = () => ''
export const numerical = (value: Value) => /\d/g.test(value) ? '' : 'Must be a number'

export default function validate<F extends Field>(
  values: Partial<Record<F, string>>,
  schema: Record<F, Validator>
) {
  const validatedValues: Partial<FormStore<F>> = {}

  for (const key in values) {
    const value = values?.[key]
    const validator = schema?.[key]

    if (value !== undefined) {
      const error = validator?.(value) ?? ''
      validatedValues[key] = { error, value }
    } else {
      validatedValues[key] = undefined
    }
  }

  return validatedValues
}
