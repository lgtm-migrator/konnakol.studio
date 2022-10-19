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
import { $newUnitType } from "~/features/editor/model/create-unit";
import { $singleUnits } from "~/features/editor/model/toolbar";
import {
  $isCreateUnitDialogOpened,
  createUnitButtonClicked,
  createUnitDialogClosed,
  newUnitFrequencyChanged,
  newUnitSymbolChanged,
  newUnitTypeSelected
} from "~/features/editor/ui/create-unit-form";
import SingleUnitCollection from "./SingleUnitCollection";

function CreateUnitForm() {
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
            onChange={({ target: { value } }) => newUnitSymbolChanged(value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Frequency"
            type="number"
            variant="standard"
            onChange={({ target: { value } }) =>
              newUnitFrequencyChanged([0, value])
            }
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

function CreateUnitDialog() {
  const selectedUnitType = useStore($newUnitType);
  const open = useStore($isCreateUnitDialogOpened);
  const close = () => createUnitDialogClosed();
  const create = () => createUnitButtonClicked();

  return (
    <div>
      <Dialog open={open} onClose={close}>
        <DialogTitle>Add Unit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a Unit to be checked. You can consider Unit as a small block
            of your rhythm that must be checked. There are different kinds of
            units: Note, Chord and Roll.
          </DialogContentText>
          <Select
            value={selectedUnitType}
            onChange={({ target: { value } }) =>
              newUnitTypeSelected(value as UnitType)
            }
          >
            <MenuItem value={UnitType.Note}>Note</MenuItem>
            <MenuItem value={UnitType.Chord}>Chord</MenuItem>
            <MenuItem value={UnitType.Roll}>Roll</MenuItem>
          </Select>

          <CreateUnitForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={create}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateUnitDialog;
