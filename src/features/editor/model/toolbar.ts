import { createStore, sample } from 'effector'
import Unit, { SingleUnit, UnitType } from '~/entities/unit/model/Unit'
import { createUnitFx } from './create-unit'

export const $units = createStore<Unit[]>([])
export const $singleUnits = $units.map(
  units => units.filter<SingleUnit>((unit): unit is SingleUnit => unit.type === UnitType.Note)
)

sample({
  clock: createUnitFx.doneData,
  source: $units,
  fn: (units, newUnit) => [...units, newUnit],
  target: $units
})
