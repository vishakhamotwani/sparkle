import { NailBase } from "./NailBase";
import type { NailComponent, NailShape } from "./types";

/** Small and round with soft, full curves. */
export const shortShape: NailShape = {
  id: "nail-short",
  name: "Short",
  height: 95,
  path: "M -34 0 C -34 -32 -22 -47 0 -47 C 22 -47 34 -32 34 0 L 34 28 C 34 44 18 47 0 47 C -18 47 -34 44 -34 28 Z",
};

export const ShortNail: NailComponent = (props) => (
  <NailBase shape={shortShape} {...props} />
);
