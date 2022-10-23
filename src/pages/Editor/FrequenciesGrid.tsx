import { Grid, TextField, InputAdornment, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { FrequencyIndex } from "~/features/editor/ui/shared";

interface IFrequenciesGridProps {
  frequencies: string[];
  changeFrequency: (frequency: [FrequencyIndex, string]) => void;
  removeFrequency: (index: FrequencyIndex) => void;
  addFrequency: () => void;
}

const FrequenciesGrid: React.FC<IFrequenciesGridProps> = ({
  frequencies,
  changeFrequency,
  removeFrequency,
  addFrequency
}) => {
  return (
    <Grid container spacing={2} alignItems="center">
      {frequencies.map((freq, i) => (
        <Grid item xs={3.5} key={i}>
          <TextField
            margin="dense"
            label="Frequency"
            value={freq}
            type="number"
            fullWidth
            variant="standard"
            onChange={({ target: { value } }) => changeFrequency([i, value])}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="error"
                    onClick={() => removeFrequency(i)}
                    edge="end"
                  >
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      ))}

      <Grid item xs={1}>
        <IconButton
          color="primary"
          className="create-unit-form__add-frequency-button"
          onClick={() => addFrequency()}
        >
          <AddIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default FrequenciesGrid;
