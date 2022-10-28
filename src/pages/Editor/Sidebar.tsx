import AddIcon from "@mui/icons-material/Add";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import {
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useStore } from "effector-react";
import { $isSidebarOpen } from "~/features/editor/ui";
import UnitComponent from "~/components/Unit";
import { createUnitDialogOpened } from "~/features/editor/ui/create-unit-form";
import { editUnitDialogOpened } from "~/features/editor/ui/edit-unit-form";
import { $units } from "~/features/editor/model/toolbar";

const Sidebar = () => {
  const open = useStore($isSidebarOpen);
  const units = useStore($units);

  return (
    <aside className="editor__sidebar">
      <ul className="activity-bar">
        <ListItem>
          <IconButton size="large">
            <MusicNoteIcon />
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton size="large">
            <MusicNoteIcon />
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton size="large">
            <MusicNoteIcon />
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton size="large">
            <MusicNoteIcon />
          </IconButton>
        </ListItem>
      </ul>
      <div >
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
      </div>
    </aside>
  );
};

export default Sidebar;
