import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import Chord from '~/entities/unit/model/Chord';
import Note from '~/entities/unit/model/Note';
import Roll from '~/entities/unit/model/Roll';
import Unit, { SingleUnit, UnitType } from '~/entities/unit/model/Unit';
import { addUnitDialogClosed, createUnitButtonClicked, editUnitButtonClicked, editUnitDialogOpened, newUnitFrequencyChanged, newUnitSymbolChanged, newUnitTypeSelected } from '~/features/editor/ui';
import { Frequency } from '~/types/fraction.types';

interface ICreateUnitFxParams {
  units: Unit[]
  newUnit: {
    type: UnitType,
    frequency: Frequency,
    symbol: string
  }
}

export const createUnitFx = createEffect(async ({ newUnit, units }: ICreateUnitFxParams) => {
  const newUnitIndex = units.length

  switch (newUnit.type) {
    case UnitType.Note: {
      return [
        new Note(newUnitIndex, { frequencies: [newUnit.frequency], symbol: newUnit.symbol }),
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
export const $editableUnit = createStore<Unit | null>(null)

export const $newUnitType = createStore<UnitType>(UnitType.Note)
export const $newUnitFrequency = createStore<Frequency>(0)
export const $newUnitSymbol = createStore<string>('')

sample({
  clock: createUnitButtonClicked,
  source: { units: $units, newUnit: combine({ type: $newUnitType, frequency: $newUnitFrequency, symbol: $newUnitSymbol }) },
  target: createUnitFx
})

sample({
  clock: createUnitFx.doneData,
  target: $units
})

sample({
  clock: createUnitFx.doneData,
  target: addUnitDialogClosed
})

sample({
  clock: newUnitTypeSelected,
  target: $newUnitType
})

sample({
  clock: newUnitFrequencyChanged,
  fn: Number,
  target: $newUnitFrequency,
})

sample({
  clock: newUnitSymbolChanged,
  target: $newUnitSymbol,
})

sample({
  clock: editUnitDialogOpened,
  source: $units,
  fn: (units, editableUnitIndex) => {
    const unit = units.find(({ index }) => index === editableUnitIndex)

    if (!unit) {
      throw new Error('Unit not found, id: ' + editableUnitIndex)
    }

    return unit
  },
  target: $editableUnit
})

