import { createEffect, createStore, sample } from 'effector';
import { UnitType } from '~/entities/unit/model';
import { addUnitFrequencyButtonClicked, createUnitButtonClicked, createUnitDialogClosed, newUnitFrequencyChanged, newUnitSymbolChanged, newUnitTypeSelected, removeUnitFrequencyButtonClicked } from '~/features/editor/ui/create-unit-form';
import Note from '~/entities/unit/model/Note';
import { reset } from 'patronum';

interface ICreateUnitFxParams {
  frequencies: string[]
  symbol: string
  shortcut: string
}

export const createUnitFx = createEffect(async ({ frequencies, symbol, shortcut }: ICreateUnitFxParams) => {
  return new Note({ frequencies: frequencies.map(Number), symbol, shortcut })
})

export const $newUnitType = createStore<UnitType>(UnitType.Note)
export const $newUnitFrequencies = createStore<string[]>([""])
export const $newUnitSymbol = createStore<string>('')
export const $newUnitShortcut = createStore<string>('')

sample({
  clock: newUnitTypeSelected,
  target: $newUnitType
})

sample({
  clock: newUnitFrequencyChanged,
  source: $newUnitFrequencies,
  fn: (freqs, [freqIdx, newFreq]) => freqs.map((fr, i) => i === freqIdx ? newFreq : fr),
  target: $newUnitFrequencies
})

sample({
  clock: newUnitSymbolChanged,
  target: $newUnitSymbol
})

sample({
  clock: createUnitButtonClicked,
  source: { type: $newUnitType, frequencies: $newUnitFrequencies, symbol: $newUnitSymbol, shortcut: $newUnitShortcut },
  target: createUnitFx
})

sample({
  clock: createUnitFx.done,
  target: createUnitDialogClosed
})

sample({
  clock: addUnitFrequencyButtonClicked,
  source: $newUnitFrequencies,
  fn: (prev) => [...prev, ""],
  target: $newUnitFrequencies
})

sample({
  clock: removeUnitFrequencyButtonClicked,
  source: $newUnitFrequencies,
  filter: Boolean,
  fn: (freqs, index) => freqs.filter((_, i) => i !== index),
  target: $newUnitFrequencies
})

reset({
  clock: createUnitDialogClosed,
  target: [$newUnitFrequencies, $newUnitSymbol, $newUnitType]
})
