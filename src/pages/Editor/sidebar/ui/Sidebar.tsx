import AddIcon from "@mui/icons-material/Add";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { IconButton, Button, ListItem } from "@mui/material";
import { useStore } from "effector-react";
import { $widget, Widgets, widgetSelected } from "~/pages/editor/konnakol/ui";
import Note from "~/components/Note";
import classNames from "classnames";
import { $units } from "../model";
import * as createUnitDialog from "~/pages/editor/dialogs/unit/create/ui";
import * as editUnitDialog from "~/pages/editor/dialogs/unit/edit/ui/shared";

const Sidebar = () => {
  const widget = useStore($widget);
  const units = useStore($units);

  return (
    <aside
      className={classNames("editor__sidebar", {
        editor__sidebar_closed: widget === null,
      })}
    >
      <ul className="activity-bar">
        <ListItem>
          <IconButton
            size="medium"
            color="secondary"
            onClick={() => widgetSelected(Widgets.Units)}
          >
            <MusicNoteIcon />
          </IconButton>
        </ListItem>
      </ul>
      {widget && (
        <div className="sidebar__widget">
          <div className="toolbar__units">
            {units.map(({ symbol }, i) => (
              <div className="toolbar__unit-button" key={i}>
                <Button
                  variant="outlined"
                  onClick={() => editUnitDialog.open(i)}
                >
                  <Note symbol={symbol} />
                </Button>
              </div>
            ))}
            <div className="toolbar__unit-button">
              <IconButton
                color="primary"
                onClick={() => createUnitDialog.open()}
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
