import React from "react";
import { Grid, TextField, InputAdornment, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MicIcon from "@mui/icons-material/Mic";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import { FrequencyIndex } from "~/shared/types";

interface IFrequenciesGridProps {
  frequencies: Array<[string, { value: string; error: string }]>;
  pitchingFrequencyIndex: FrequencyIndex | null;
  updateFrequency: (frequency: [FrequencyIndex, string]) => void;
  removeFrequency: (index: FrequencyIndex) => void;
  pitchFrequency: (index: FrequencyIndex) => void;
  addFrequency: () => void;
}

const FrequenciesGrid: React.FC<IFrequenciesGridProps> = ({
  frequencies,
  updateFrequency,
  removeFrequency,
  pitchFrequency,
  addFrequency,
  pitchingFrequencyIndex,
}) => {
  return (
    <Grid container spacing={2} alignItems="center">
      {frequencies.map(([name, { value, error }], i) => (
        <Grid item xs={3.5} key={name}>
          <TextField
            margin="dense"
            label="Frequency"
            name={name}
            value={value}
            error={Boolean(error)}
            helperText={error}
            type="number"
            fullWidth
            variant="standard"
            onChange={({ target: { value } }) => updateFrequency([i, value])}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      {pitchingFrequencyIndex === i ? (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => pitchFrequency(i)}
                          edge="end"
                        >
                          <DoneIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => pitchFrequency(i)}
                          edge="end"
                        >
                          <MicIcon />
                        </IconButton>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFrequency(i)}
                        edge="end"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
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
