import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import { useStore } from "effector-react";
import {
  $newUnitFrequencies,
} from "~/features/editor/model/create-unit";
import {
  $isCreateUnitDialogOpened,
  addUnitFrequencyButtonClicked,
  createUnitButtonClicked,
  createUnitDialogClosed,
  newUnitFrequencyChanged,
  newUnitSymbolChanged,
  removeUnitFrequencyButtonClicked,
} from "~/features/editor/ui/create-unit-form";
import FrequenciesGrid from "./FrequenciesGrid";

// TODO: add validation for a symbol/shortcut

function CreateUnitDialog() {
  const frequencies = useStore($newUnitFrequencies)
  const open = useStore($isCreateUnitDialogOpened);
  const close = () => createUnitDialogClosed();
  const create = () => createUnitButtonClicked();

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Add Unit</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a Unit to be checked. You can consider Unit as a small block of
          your rhythm that must be checked. There are different kinds of units:
          Note, Chord and Roll.
        </DialogContentText>
        <TextField
            fullWidth
            margin="dense"
            label="Symbol"
            type="text"
            variant="standard"
            onChange={({ target: { value } }) => newUnitSymbolChanged(value)}
          />
          <FrequenciesGrid
            frequencies={frequencies}
            addFrequency={addUnitFrequencyButtonClicked}
            changeFrequency={newUnitFrequencyChanged}
            removeFrequency={removeUnitFrequencyButtonClicked}
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={create}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateUnitDialog;
