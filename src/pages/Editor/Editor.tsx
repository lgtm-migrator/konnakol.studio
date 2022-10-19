import "./Editor.css";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import { useStore } from "effector-react";
import UnitComponent from "~/components/Unit";
import AddUnitDialog from "./CreateUnitDialog";
import EditUnitDialog from "./EditUnitDialog";
import { createUnitDialogOpened } from "~/features/editor/ui/create-unit-form";
import { editUnitDialogOpened } from "~/features/editor/ui/edit-unit-form";
import { $units } from "~/features/editor/model/toolbar";

function Editor() {
  const { compositionId } = useParams();
  const units = useStore($units);

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
          <AddUnitDialog />
          <EditUnitDialog />
        </div>
      </aside>
      <div className="editor__partitura"></div>
    </main>
  );
}

export default Editor;
