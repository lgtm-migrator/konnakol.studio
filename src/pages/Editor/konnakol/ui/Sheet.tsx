import { TextField } from "@mui/material";
import { useStore } from "effector-react";
import Tact from "~/components/Tact";
import Title from "~/pages/editor/Title";
import { konnakolChanged } from "~/pages/editor/konnakol/ui";
import { $composition, $konnakol } from "~/pages/editor/konnakol/model";

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
