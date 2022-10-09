import { combine, createEffect, createStore, sample } from 'effector';
import cloneDeep from 'lodash.clonedeep';
import Chord from '~/entities/unit/model/Chord';
import Note from '~/entities/unit/model/Note';
import Roll from '~/entities/unit/model/Roll';
import Unit, { SingleUnit, UnitType } from '~/entities/unit/model/Unit';
import {
  createUnitButtonClicked,
  createUnitDialogClosed,
  editUnitButtonClicked,
  editUnitDialogOpened,
  newUnitFrequencyChanged,
  newUnitSymbolChanged,
  newUnitTypeSelected,
} from '~/features/editor/ui';
import { Frequency } from '~/types/fraction.types';
import { NonNullableStructure } from '~/utils/types.utils';

interface ICreateUnitFxParams {
  type: UnitType
  frequencies: Frequency[]
  symbol: string
}

interface IEditUnitFxSource {
  units: Unit[]
  newUnit: Unit | null
  index: number | null
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

export const $units = createStore<Unit[]>([])
export const $singleUnits = $units.map(
  units => units.filter<SingleUnit>((unit): unit is SingleUnit => unit.type === UnitType.Note)
)

export const $newUnitType = createStore<UnitType>(UnitType.Note)
export const $newUnitFrequencies = createStore<Frequency[]>([0])
export const $newUnitSymbol = createStore<string>('')

export const $editableUnitIndex = createStore<number | null>(null)
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
  source: combine({ type: $newUnitType, frequencies: $newUnitFrequencies, symbol: $newUnitSymbol }),
  target: createUnitFx
})

sample({
  clock: createUnitFx.doneData,
  source: $units,
  fn: (units, newUnit) => [...units, newUnit],
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

sample({
  clock: editUnitButtonClicked,
  source: { units: $units, newUnit: $editableUnit, index: $editableUnitIndex },
  filter: (source: IEditUnitFxSource): source is NonNullableStructure<IEditUnitFxSource> => (
    source.index !== null && source.newUnit !== null
  ),
  fn: ({ units, index, newUnit }) => units.map((prev, i) => i === index ? newUnit : prev),
  target: $units
})