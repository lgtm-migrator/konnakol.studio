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
  $frequencies,
  $symbol,
  $editableUnit,
} from "~/features/editor/model/edit-unit";
import {
  $isEditUnitDialogOpened,
  editableUnitFrequencyAdded,
  editableUnitFrequencyChanged,
  editableUnitFrequencyRemoved,
  editableUnitSymbolChanged,
  editUnitButtonClicked,
  editUnitDialogClosed,
} from "~/features/editor/ui/edit-unit-form";
import FrequenciesGrid from "./FrequenciesGrid";

function EditUnitDialog() {
  const unit = useStore($editableUnit);
  const open = useStore($isEditUnitDialogOpened);
  const symbol = useStore($symbol);
  const frequencies = useStore($frequencies);
  const close = () => editUnitDialogClosed();
  const save = () => editUnitButtonClicked();

  return (
    <>
      {unit && (
        <Dialog open={open} onClose={close} fullWidth>
          <DialogTitle>Edit Unit</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit existing unit.</DialogContentText>
            <TextField
              fullWidth
              margin="dense"
              label="Symbol"
              type="text"
              variant="standard"
              value={symbol}
              onChange={({ target: { value } }) =>
                editableUnitSymbolChanged(value)
              }
            />
            <FrequenciesGrid
              frequencies={frequencies}
              addFrequency={editableUnitFrequencyAdded}
              changeFrequency={editableUnitFrequencyChanged}
              removeFrequency={editableUnitFrequencyRemoved}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default EditUnitDialog;
