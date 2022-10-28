import "./Editor.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
  Typography,
} from "@mui/material";
import { useStore } from "effector-react";
import UnitComponent from "~/components/Unit";
import AddUnitDialog from "./CreateUnitDialog";
import EditUnitDialog from "./EditUnitDialog";
import PlayIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { createUnitDialogOpened } from "~/features/editor/ui/create-unit-form";
import { editUnitDialogOpened } from "~/features/editor/ui/edit-unit-form";
import { $units } from "~/features/editor/model/toolbar";
import Sheet from "./Sheet";
import {
  compositionNameChanged,
  editCompositionNameButtonClicked,
  saveCompositionNameButtonClicked,
} from "~/features/editor/ui";
import {
  $compositionName,
  $isCompositionNameEditing,
} from "~/features/editor/model";

const actions = [
  { icon: <PlayIcon />, name: "Play", onClick: () => {} },
  { icon: <SaveIcon />, name: "Save", onClick: () => {} },
  { icon: <ShareIcon />, name: "Share", onClick: () => {} },
];

function Editor() {
  const { compositionId } = useParams();
  const units = useStore($units);
  const isCompositionNameEditing = useStore($isCompositionNameEditing);
  const compositionName = useStore($compositionName);

  return (
    <main className="editor">
      <aside className="editor__toolbar">
        <div className="toolbar__units">
          {units.map((unit, i) => (
            <div className="toolbar__unit-button" key={i}>
              <Button onClick={() => editUnitDialogOpened(i)}>
                <UnitComponent unit={unit} />
              </Button>
            </div>
          ))}
          <div className="toolbar__unit-button">
            <IconButton
              color="primary"
              onClick={() => createUnitDialogOpened()}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
      </aside>
      <header className="editor__heading">
        {!isCompositionNameEditing ? (
          <Typography variant="h3">{compositionName}</Typography>
        ) : (
          <TextField
            defaultValue={compositionName}
            value={compositionName}
            onChange={({ target: { value } }) => compositionNameChanged(value)}
          />
        )}
        {!isCompositionNameEditing ? (
          <IconButton
            color="primary"
            onClick={() => editCompositionNameButtonClicked()}
          >
            <EditIcon />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            onClick={() => saveCompositionNameButtonClicked()}
          >
            <DoneIcon />
          </IconButton>
        )}
      </header>
      <Sheet />
      <AddUnitDialog />
      <EditUnitDialog />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </main>
  );
}

export default Editor;
