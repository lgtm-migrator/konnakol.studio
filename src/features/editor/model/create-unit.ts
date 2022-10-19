import { createEffect, createStore, sample } from 'effector';
import { UnitType } from '~/entities/unit/model';
import type { Frequency } from '~/types/fraction.types';
import { $isCreateUnitDialogOpened, createUnitButtonClicked, newUnitFrequencyChanged, newUnitSymbolChanged, newUnitTypeSelected } from '~/features/editor/ui/create-unit-form';
import Note from '~/entities/unit/model/Note';
import Chord from '~/entities/unit/model/Chord';
import Roll from '~/entities/unit/model/Roll';

interface ICreateUnitFxParams {
  type: UnitType
  frequencies: Frequency[]
  symbol: string
}

export const createUnitFx = createEffect(async (newUnit: ICreateUnitFxParams) => {
  switch (newUnit.type) {
    case UnitType.Note: {
      return new Note({ frequencies: newUnit.frequencies, symbol: newUnit.symbol })
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
export const $newUnitFrequencies = createStore<Frequency[]>([0])
export const $newUnitSymbol = createStore<string>('')

sample({
  clock: newUnitTypeSelected,
  target: $newUnitType
})

sample({
  clock: newUnitFrequencyChanged,
  source: $newUnitFrequencies,
  fn: (freqs, [freqIdx, newFreq]) => freqs.map((fr, i) => i === freqIdx ? Number(newFreq) : fr),
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
  fn: () => false,
  target: $isCreateUnitDialogOpened
})
