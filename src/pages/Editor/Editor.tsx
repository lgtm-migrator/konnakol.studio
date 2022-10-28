import "./Editor.css";
import { useParams } from "react-router-dom";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import AddUnitDialog from "./CreateUnitDialog";
import EditUnitDialog from "./EditUnitDialog";
import PlayIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import Sheet from "./Sheet";
import Header from './Header';
import Sidebar from './Sidebar';

const actions = [
  { icon: <PlayIcon />, name: "Play", onClick: () => {} },
  { icon: <SaveIcon />, name: "Save", onClick: () => {} },
  { icon: <ShareIcon />, name: "Share", onClick: () => {} },
];

function Editor() {
  const { compositionId } = useParams();

  return (
    <main className="editor">
      <Sidebar />
      <Header />
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
