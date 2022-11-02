import { PitcherName, pitchers } from '~/shared/pitch/shared'

export const bpm = (value: ReturnType<typeof prompt>) => {
  if (!value) {
    throw new Error('No BPM provided.')
  }

  const numberValue = Number(value)

  if (isNaN(numberValue)) {
    throw new Error('BPM must be a number')
  }

  return numberValue
}

export const pitcher = (value: string): PitcherName => {
  const validatedValue = value as PitcherName
  
  if (pitchers[validatedValue]) {
    return validatedValue
  }

  throw new Error(`Incorrect pitcher given: ${value}`)
}
