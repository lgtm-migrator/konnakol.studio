import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useStore } from "effector-react";
import { createEvent, createStore } from "effector";
import { $pitchingFrequencyIndex } from "../model";
import { $store as $form, update, $frequencies, save } from "./form";
import {
  add as addFrequency,
  update as updateFrequency,
  remove as removeFrequency,
  pitch as pitchFrequency,
} from "./frequencies";
import FrequenciesGrid from "~/pages/editor/dialogs/unit/shared/FrequenciesGrid";

export const $isOpen = createStore(false);

export const open = createEvent();
export const close = createEvent();

$isOpen
  .on(open, () => true)
  .on(close, () => false)
  .on(save, () => false);

function CreateUnitDialog() {
  const isOpen = useStore($isOpen);
  const pitchingFrequencyIndex = useStore($pitchingFrequencyIndex);
  const form = useStore($form);
  const frequencies = useStore($frequencies);

  return (
    <>
      {
        <Dialog open={isOpen} onClose={() => close()} fullWidth>
          <DialogTitle>Edit Unit</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit an existing unit.</DialogContentText>
            <TextField
              fullWidth
              margin="dense"
              label="Symbol"
              type="text"
              variant="standard"
              value={form.symbol.value}
              name="symbol"
              onChange={({ target: { value } }) => update({ symbol: value })}
            />
            <FrequenciesGrid
              frequencies={frequencies}
              addFrequency={addFrequency}
              updateFrequency={updateFrequency}
              removeFrequency={removeFrequency}
              pitchFrequency={pitchFrequency}
              pitchingFrequencyIndex={pitchingFrequencyIndex}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => close()}>Cancel</Button>
            <Button onClick={() => save()}>Save</Button>
          </DialogActions>
        </Dialog>
      }
    </>
  );
}

export default CreateUnitDialog;
