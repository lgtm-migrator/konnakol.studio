import "./Editor.css";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import { Button, IconButton, MenuItem, Select } from "@mui/material";
import { useStore } from "effector-react";
import {
  $isAddUnitDialogOpened,
  addUnitDialogClosed,
  addUnitDialogOpened,
  createUnitButtonClicked,
  newUnitFrequencyChanged,
  newUnitSymbolChanged,
  newUnitTypeSelected,
} from "~/features/editor/ui";
import { UnitType } from "~/entities/unit/model";
import { SingleUnit } from "~/entities/unit/model/Unit";
import NoteComponent from "~/components/Note";
import { $newUnitType, $singleUnits, $units } from "~/features/editor/model";
import UnitComponent from "~/components/Unit";

interface ISingleUnitCollectionProps {
  units: SingleUnit[];
}

function SingleUnitCollection({ units }: ISingleUnitCollectionProps) {
  return (
    <div className="units-collection">
      {units.map((unit, i) => (
        <NoteComponent symbol={unit.symbol} key={i} />
      ))}
    </div>
  );
}

function AddUnitForm() {
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
            onChange={({ target: { value } }) => newUnitFrequencyChanged(value)}
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

function AddUnitDialog() {
  const selectedUnitType = useStore($newUnitType);
  const open = useStore($isAddUnitDialogOpened);
  const close = () => addUnitDialogClosed();
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

          <AddUnitForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={create}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Editor() {
  const { compositionId } = useParams();
  const units = useStore($units);

  return (
    <main className="editor">
      <aside className="editor__toolbar">
        <div className="toolbar__units">
          {units.map((unit, i) => (
            <div className="toolbar__unit-button" key={i}>
              <Button>
                <UnitComponent unit={unit} />
              </Button>
            </div>
          ))}
          <div className="toolbar__unit-button">
            <IconButton color="primary" onClick={() => addUnitDialogOpened()}>
              <AddIcon />
            </IconButton>
          </div>
          <AddUnitDialog />
        </div>
      </aside>
      <div className="editor__partitura"></div>
    </main>
  );
}

export default Editor;
