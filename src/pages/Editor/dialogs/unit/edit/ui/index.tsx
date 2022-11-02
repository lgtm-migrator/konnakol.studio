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
import { $pitchingFrequencyIndex } from "../model";
import { $store as $form, update, $frequencies } from "./form";
import {
  add as addFrequency,
  update as updateFrequency,
  remove as removeFrequency,
  pitch as pitchFrequency,
} from "./frequencies";
import FrequenciesGrid from "../../shared/FrequenciesGrid";
import { $isOpen, save } from "./shared";

function EditUnitDialog() {
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

export default EditUnitDialog;
