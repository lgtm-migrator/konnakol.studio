import { createEffect, createStore, sample } from 'effector';
import { UnitType } from '~/entities/unit/model';
import { $isCreateUnitDialogOpened, addUnitFrequencyButtonClicked, createUnitButtonClicked, createUnitDialogClosed, newUnitFrequencyChanged, newUnitSymbolChanged, newUnitTypeSelected, removeUnitFrequencyButtonClicked } from '~/features/editor/ui/create-unit-form';
import Note from '~/entities/unit/model/Note';
import Chord from '~/entities/unit/model/Chord';
import Roll from '~/entities/unit/model/Roll';
import { reset } from 'patronum';

interface ICreateUnitFxParams {
  type: UnitType
  frequencies: string[]
  symbol: string
}

export const createUnitFx = createEffect(async (newUnit: ICreateUnitFxParams) => {
  switch (newUnit.type) {
    case UnitType.Note: {
      return new Note({ frequencies: newUnit.frequencies.map(Number), symbol: newUnit.symbol })
    }

    case UnitType.Chord: {
      return new Chord([])
    }

    case UnitType.Roll: {
      return new Roll([])
    }
  }
})

export const $newUnitType = createStore<UnitType>(UnitType.Note)
export const $newUnitFrequencies = createStore<string[]>([""])
export const $newUnitSymbol = createStore<string>('')

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
  source: { type: $newUnitType, frequencies: $newUnitFrequencies, symbol: $newUnitSymbol },
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
