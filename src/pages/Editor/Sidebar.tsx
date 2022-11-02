import AddIcon from "@mui/icons-material/Add";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { IconButton, Button, ListItem } from "@mui/material";
import { useStore } from "effector-react";
import { $widget, Widgets, widgetSelected } from "~/features/editor/ui";
import { createUnitDialogOpened } from "~/features/editor/ui/create-unit-form";
import { editUnitDialogOpened } from "~/features/editor/ui/edit-unit-form";
import { $units } from "~/features/editor/model/toolbar";
import Note from "~/components/Note";
import classNames from "classnames";

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
        {/* <ListItem>
          <IconButton size="medium" color="primary">
            <MusicNoteIcon />
          </IconButton>
        </ListItem> */}
      </ul>
      {widget && (
        <div className="sidebar__widget">
          <div className="toolbar__units">
            {units.map(({ symbol }, i) => (
              <div className="toolbar__unit-button" key={i}>
                <Button
                  variant="outlined"
                  onClick={() => editUnitDialogOpened(i)}
                >
                  <Note symbol={symbol} />
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
      )}
    </aside>
  );
};

export default Sidebar;
