import AddIcon from "@mui/icons-material/Add";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import classNames from "classnames";
import { IconButton, Button, ListItem } from "@mui/material";
import { useStore } from "effector-react";
import Note from "~/components/Note";
import { $widget, Widgets, widgetSelected } from "~/pages/editor/konnakol/ui";
import { $units } from "../model";
import { unitChosen } from "~/pages/editor/dialogs/unit/edit/model";
import { popup as createUnitPopup } from "~/pages/editor/dialogs/unit/create/model";

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
                <Button variant="outlined" onClick={() => unitChosen(i)}>
                  <Note symbol={symbol} />
                </Button>
              </div>
            ))}
            <div className="toolbar__unit-button">
              <IconButton
                color="primary"
                onClick={() => createUnitPopup.open()}
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
