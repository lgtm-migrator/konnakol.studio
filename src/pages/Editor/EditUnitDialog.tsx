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
  $frequencies,
  $symbol,
  $editableUnit,
} from "~/features/editor/model/edit-unit";
import { $singleUnits } from "~/features/editor/model/toolbar";
import {
  $isEditUnitDialogOpened,
  editableUnitFrequencyChanged,
  editableUnitSymbolChanged,
  editableUnitTypeSelected,
  editUnitButtonClicked,
  editUnitDialogClosed,
} from "~/features/editor/ui/edit-unit-form";
import SingleUnitCollection from "./SingleUnitCollection";

function EditUnitForm() {
  const unit = useStore($editableUnit);
  const singleUnits = useStore($singleUnits);
  const symbol = useStore($symbol);
  const frequencies = useStore($frequencies);

  const onFrequencyChanged = (value: string) => {
    // validate(value)
    editableUnitFrequencyChanged([0, +value]);
  };

  switch (unit?.type) {
    case UnitType.Note: {
      return (
        <>
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
          {frequencies &&
            frequencies.map((freq, key) => (
              <TextField
                key={key}
                fullWidth
                margin="dense"
                label="Frequency"
                type="number"
                variant="standard"
                value={freq}
                onChange={({ target: { value } }) => onFrequencyChanged(value)}
              />
            ))}
        </>
      );
    }

    case UnitType.Chord: {
      return <SingleUnitCollection units={singleUnits} />;
    }

    case UnitType.Roll: {
      return <SingleUnitCollection units={singleUnits} />;
    }

    default: {
      return <>Invalid unit: {unit?.type}</>;
    }
  }
}

function EditUnitDialog() {
  const unit = useStore($editableUnit);
  const open = useStore($isEditUnitDialogOpened);
  const close = () => editUnitDialogClosed();
  const save = () => editUnitButtonClicked();

  return (
    <>
      {unit && (
        <Dialog open={open} onClose={close}>
          <DialogTitle>Edit Unit</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit existing unit.</DialogContentText>
            <Select
              value={unit.type}
              onChange={({ target: { value } }) =>
                editableUnitTypeSelected(value as UnitType)
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
      )}
    </>
  );
}

export default EditUnitDialog;
