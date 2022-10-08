import { combine, createEffect, createStore, sample } from 'effector';
import cloneDeep from 'lodash.clonedeep';
import Chord from '~/entities/unit/model/Chord';
import Note from '~/entities/unit/model/Note';
import Roll from '~/entities/unit/model/Roll';
import Unit, { SingleUnit, UnitType } from '~/entities/unit/model/Unit';
import {
  createUnitButtonClicked,
  createUnitDialogClosed,
  editUnitDialogOpened,
  newUnitFrequencyChanged,
  newUnitSymbolChanged,
  newUnitTypeSelected,
} from '~/features/editor/ui';
import { Frequency } from '~/types/fraction.types';

interface ICreateUnitFxParams {
  units: Unit[]
  newUnit: {
    type: UnitType,
    frequencies: Frequency[],
    symbol: string
  }
}

export const createUnitFx = createEffect(async ({ newUnit, units }: ICreateUnitFxParams) => {
  const newUnitIndex = units.length

  switch (newUnit.type) {
    case UnitType.Note: {
      return [
        new Note(newUnitIndex, { frequencies: newUnit.frequencies, symbol: newUnit.symbol }),
        ...units
      ]
    }

    case UnitType.Chord: {
      return [new Chord(newUnitIndex, []), ...units]
    }

    case UnitType.Roll: {
      return [new Roll(newUnitIndex, []), ...units]
    }
  }
})

export const $units = createStore<Unit[]>([])
export const $singleUnits = $units.map(
  units => units.filter<SingleUnit>((unit): unit is SingleUnit => unit.type === UnitType.Note)
)

export const $newUnitType = createStore<UnitType>(UnitType.Note)
export const $newUnitFrequencies = createStore<Frequency[]>([0])
export const $newUnitSymbol = createStore<string>('')

export const $editableUnitIndex = createStore<number | null>(null)
export const $editableUnitType = createStore<UnitType>(UnitType.Note)
export const $editableUnitFrequencies = createStore<Frequency[]>([0])
export const $editableUnitSymbol = createStore<string>('')
export const $editableUnit = combine(
  $units,
  $editableUnitIndex,
  (units, index) => {
    if (index === null) {
      return null
    }

    const unit = units[index]
    return cloneDeep(unit)
  }
)

sample({
  clock: createUnitButtonClicked,
  source: {
    units: $units,
    newUnit: combine({ type: $newUnitType, frequencies: $newUnitFrequencies, symbol: $newUnitSymbol })
  },
  target: createUnitFx
})

sample({
  clock: createUnitFx.doneData,
  target: $units
})

sample({
  clock: createUnitFx.doneData,
  target: createUnitDialogClosed
})

sample({
  clock: newUnitTypeSelected,
  target: $newUnitType
})

sample({
  clock: newUnitFrequencyChanged,
  source: $newUnitFrequencies,
  fn: (freqs, [index, newFreq]) => freqs.map((freq, i) => i === index ? Number(newFreq) : freq),
  target: $newUnitFrequencies,
})

sample({
  clock: newUnitSymbolChanged,
  target: $newUnitSymbol,
})

sample({
  clock: editUnitDialogOpened,
  target: $editableUnitIndex
})