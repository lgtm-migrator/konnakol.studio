import { combine, createStore, sample } from 'effector';
import { compositionNameChanged, editCompositionNameButtonClicked, konnakolChanged, saveCompositionNameButtonClicked } from '../ui';
import parseKonnakol from './parser';
import { $unitsAsMapping } from '../../sidebar/model';

export const $compositionName = createStore('');
export const $konnakol = createStore('');
export const $isCompositionNameEditing = createStore(false);

export const $composition = combine(
  $unitsAsMapping,
  $konnakol,
  parseKonnakol
)

sample({
  clock: konnakolChanged,
  target: $konnakol
})

sample({
  clock: compositionNameChanged,
  target: $compositionName
})

sample({
  clock: editCompositionNameButtonClicked,
  fn: () => true,
  target: $isCompositionNameEditing
})

sample({
  clock: saveCompositionNameButtonClicked,
  fn: () => false,
  target: $isCompositionNameEditing
})



