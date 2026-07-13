import { NailBase } from "./NailBase";
import type { NailComponent, NailShape } from "./types";

/** Flat tip with generously rounded corners; sides ease in softly. */
export const coffinShape: NailShape = {
  id: "nail-coffin",
  name: "Coffin",
  height: 150,
  path: "M -16 -68 C -4 -76 4 -76 16 -68 C 28 -50 34 -28 36 -8 L 36 55 C 36 72 20 75 0 75 C -20 75 -36 72 -36 55 L -36 -8 C -34 -28 -28 -50 -16 -68 Z",
};

export const CoffinNail: NailComponent = (props) => (
  <NailBase shape={coffinShape} {...props} />
);
