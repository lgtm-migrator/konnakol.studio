import { createEvent, sample } from 'effector';
import { instantiatePopup } from "~/pages/editor/dialogs/unit/shared/popup";
import { instantiateUnitForm } from "~/pages/editor/dialogs/unit/shared/form";
import { $units } from '~/pages/editor/sidebar/model';
import Note from '~/entities/unit/model/Note';
import { reset } from 'patronum';

export const created = createEvent()

export const popup = instantiatePopup();
export const form = instantiateUnitForm();

sample({
  clock: created,
  source: { units: $units, form: form.$store, frequencies: form.frequencies.$store },
  fn: ({ units, form, frequencies }) => ([
    ...units,
    new Note({
      symbol: form.symbol.value,
      frequencies: frequencies.map(([_, { value }]) => Number(value)),
    })
  ]),
  target: $units
})

sample({
  clock: created,
  target: popup.close
})

reset({
  clock: popup.close,
  target: [form.$store]
})
