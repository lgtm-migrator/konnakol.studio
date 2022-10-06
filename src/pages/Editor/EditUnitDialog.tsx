import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useStore } from "effector-react";
import { UnitType } from "~/entities/unit/model";
import {
  $editableUnit,
  $newUnitType,
  $singleUnits,
  $units,
} from "~/features/editor/model";
import {
  $isEditUnitDialogOpened,
  editUnitButtonClicked,
  editUnitDialogClosed,
  unitFrequencyChanged,
  unitSymbolChanged,
  unitTypeSelected,
} from "~/features/editor/ui";
import SingleUnitCollection from "./SingleUnitCollection";

function EditUnitForm() {
  const unitType = useStore($newUnitType);
  const singleUnits = useStore($singleUnits);

  switch (unitType) {
    case UnitType.Note: {
      return (
        <>
          <TextField
            fullWidth
            margin="dense"
            label="Symbol"
            type="text"
            variant="standard"
            onChange={({ target: { value } }) => unitSymbolChanged(value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Frequency"
            type="number"
            variant="standard"
            onChange={({ target: { value } }) => unitFrequencyChanged(value)}
          />
        </>
      );
    }

    case UnitType.Chord: {
      return <SingleUnitCollection units={singleUnits} />;
    }

    case UnitType.Roll: {
      return <SingleUnitCollection units={singleUnits} />;
    }
  }
}

function EditUnitDialog() {
  const editableUnit = useStore($editableUnit);
  const open = useStore($isEditUnitDialogOpened);
  const close = () => editUnitDialogClosed();
  const save = () => editUnitButtonClicked();

  if (!editableUnit) {
    return null;
  }

  return (
    <div>
      <Dialog open={open} onClose={close}>
        <DialogTitle>Edit Unit</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit existing unit.</DialogContentText>
          <Select
            value={editableUnit.type}
            onChange={({ target: { value } }) =>
              unitTypeSelected(value as UnitType)
            }
          >
            <MenuItem value={UnitType.Note}>Note</MenuItem>
            <MenuItem value={UnitType.Chord}>Chord</MenuItem>
            <MenuItem value={UnitType.Roll}>Roll</MenuItem>
          </Select>

          <EditUnitForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditUnitDialog;
