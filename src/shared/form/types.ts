export type Field = string
export type Value = string
export type Error = string
export type FormValues<F extends Field> = Record<F, Value>

export type Validator = (value: Value) => Error

export type FormStore<F extends Field = Field> = {
  [field in F]: {
    value: Value
    error: Error
  }
}