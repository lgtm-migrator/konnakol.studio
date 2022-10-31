import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { Typography, TextField, IconButton } from "@mui/material";
import { useStore } from "effector-react";
import {
  $isCompositionNameEditing,
  $compositionName,
} from "~/features/editor/model";
import {
  compositionNameChanged,
  editCompositionNameButtonClicked,
  saveCompositionNameButtonClicked,
} from "~/features/editor/ui";

const Title = () => {
  const isCompositionNameEditing = useStore($isCompositionNameEditing);
  const compositionName = useStore($compositionName);

  return (
    <header className="editor__title">
      {!isCompositionNameEditing ? (
        <Typography variant="h3">{compositionName}</Typography>
      ) : (
        <TextField
          value={compositionName}
          variant="standard"
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
  );
};

export default Title;