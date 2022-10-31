import "./Editor.css";
import { useParams } from "react-router-dom";
import { AppBar, Button, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon, Toolbar, Typography } from "@mui/material";
import AddUnitDialog from "./CreateUnitDialog";
import EditUnitDialog from "./EditUnitDialog";
import PlayIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import MenuIcon from "@mui/icons-material/Menu";
import Sheet from "./Sheet";
import Title from "./Title";
import Sidebar from "./Sidebar";

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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Sidebar />
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
