import { combine, createEffect, createStore, sample } from 'effector';
import Unit, { hasFrequencies, isRenderable, Renderable, SingleUnit, UnitType, WithFrequencies } from '~/entities/unit/model/Unit';
import { editableUnitFrequencyAdded, editableUnitFrequencyChanged, editableUnitFrequencyRemoved, editableUnitSymbolChanged, editUnitButtonClicked, editUnitDialogClosed, editUnitDialogOpened } from '~/features/editor/ui/edit-unit-form';
import { $units } from '~/features/editor/model/toolbar';
import Note from '~/entities/unit/model/Note';
import { NonNullableStructure } from '~/utils/types.utils';

interface IEditUnitFxParams {
  index: number
  unit: SingleUnit
}

interface IEditNoteParams extends IEditUnitFxParams {
  frequencies: string[]
  symbol: string
}

export const editUnitFx = createEffect(async ({ frequencies, symbol, index }: IEditNoteParams) => {
  return { unit: new Note({ frequencies: frequencies.map(Number), symbol }), index }
})

export const $editableUnitIndex = createStore<number | null>(null)
export const $editableUnit = combine(
  $units, $editableUnitIndex,
  (units, index) => index !== null ? units.at(index) ?? null : null // TODO: refactor
)

export const $frequencies = createStore<string[]>([])
export const $symbol = createStore<string | null>(null)

sample({
  clock: editUnitDialogOpened,
  target: $editableUnitIndex
})

sample({
  clock: $editableUnit,
  filter: (unit: Unit | null): unit is SingleUnit & Renderable => Boolean(unit && isRenderable(unit)),
  fn: ({ symbol }) => symbol,
  target: $symbol
})

sample({
  clock: $editableUnit,
  filter: (unit: Unit | null): unit is SingleUnit & WithFrequencies => Boolean(unit && hasFrequencies(unit)),
  fn: ({ frequencies }) => frequencies.map(String),
  target: $frequencies
})

sample({
  clock: editableUnitFrequencyChanged,
  source: $frequencies,
  fn: (frequencies, [index, newFrequency]) => frequencies.map((prevFrequency, i) => i === index ? newFrequency : prevFrequency),
  target: $frequencies
})

sample({
  clock: editableUnitSymbolChanged,
  target: $symbol
})

sample({
  clock: editUnitButtonClicked,
  source: { index: $editableUnitIndex, unit: $editableUnit, frequencies: $frequencies, symbol: $symbol },
  filter: (source): source is NonNullableStructure<IEditNoteParams> => Object.values(source).every(v => v !== null),
  target: editUnitFx
})

sample({
  clock: editUnitFx.doneData,
  source: $units,
  fn: (prevUnits, { unit: newUnit, index }) => prevUnits.map((prevUnit, i) => i === index ? newUnit : prevUnit),
  target: $units
})

sample({
  clock: editUnitFx.done,
  target: editUnitDialogClosed
})

sample({
  clock: editableUnitFrequencyAdded,
  source: $frequencies,
  fn: (freqs) => [...freqs, ''],
  target: $frequencies
})

sample({
  clock: editableUnitFrequencyRemoved,
  source: $frequencies,
  fn: (freqs, index) => freqs.filter((_, i) => i !== index),
  target: $frequencies
})
