import { TextField } from "@mui/material";
import { useStore } from "effector-react";
import Tact from "~/components/Tact";
import { $composition, $konnakol } from "~/features/editor/model";
import { konnakolChanged } from "~/features/editor/ui";
import Title from "./Title";

const Sheet = () => {
  const konnakol = useStore($konnakol);
  const composition = useStore($composition);

  return (
    <section className="sheet">
      <Title />
      <TextField
        multiline
        fullWidth
        value={konnakol}
        onChange={({ target: { value } }) => konnakolChanged(value)}
        minRows={5}
        placeholder="Your konnakol here..."
      />

      <div>
        {composition.map((tact, i) => (
          <Tact key={i} units={tact.units} />
        ))}
      </div>
    </section>
  );
};

export default Sheet;
