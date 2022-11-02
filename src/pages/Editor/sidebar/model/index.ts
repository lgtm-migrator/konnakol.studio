import { createStore, sample } from 'effector'
import { SingleUnit } from '~/entities/unit/model/Unit'
import { createUnitFx } from '~/entities/unit/api';

export interface ShorcutsToUnits {
  [shortcut: string]: SingleUnit
}

export const $units = createStore<SingleUnit[]>([])

export const $unitsAsMapping = $units.map(
  units => units.reduce<ShorcutsToUnits>((acc, u) => ({ ...acc, [u.shortcut]: u }), {})
);

sample({
  clock: createUnitFx.doneData,
  source: $units,
  fn: (units, newUnit) => [...units, newUnit],
  target: $units
})

