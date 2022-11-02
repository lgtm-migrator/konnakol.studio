import "./Editor.css";
import { useParams } from "react-router-dom";
import {
  AppBar,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import MenuIcon from "@mui/icons-material/Menu";
import Sheet from "./konnakol/ui/Sheet";
import Sidebar from "./sidebar/ui/Sidebar";
import EditUnitDialog from './dialogs/unit/edit/ui';
import CreateUnitDialog from './dialogs/unit/create/ui';

const actions = [
  { icon: <PlayIcon />, name: "Play", onClick: () => {} },
  { icon: <SaveIcon />, name: "Save", onClick: () => {} },
  { icon: <ShareIcon />, name: "Share", onClick: () => {} },
];

function Editor() {
  const { compositionId } = useParams();

  return (
    <main className="editor">
      <AppBar position="static" className="editor__appbar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Editor
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <Sheet />
      <CreateUnitDialog />
      <EditUnitDialog />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
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
