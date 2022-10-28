import { TextField } from "@mui/material";
import { useStore } from "effector-react";
import Tact from "~/components/Tact";
import { $composition, $konnakol } from "~/features/editor/model";
import { konnakolChanged } from "~/features/editor/ui";

const Sheet = () => {
  const konnakol = useStore($konnakol);
  const composition = useStore($composition);

  return (
    <section className="sheet">
      <TextField
        multiline
        fullWidth
        value={konnakol}
        onChange={({ target: { value } }) => konnakolChanged(value)}
        minRows={5}
        placeholder="Your konnakol here..."
      />

      {composition.map((tact, i) => (
        <Tact key={i} units={tact.units} />
      ))}
    </section>
  );
};

export default Sheet;
