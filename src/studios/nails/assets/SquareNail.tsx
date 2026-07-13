import { NailBase } from "./NailBase";
import type { NailComponent, NailShape } from "./types";

/** Flat tip with large rounded corners — no sharp 90° edges. */
export const squareShape: NailShape = {
  id: "nail-square",
  name: "Square",
  height: 135,
  path: "M -20 -64 C -36 -64 -36 -48 -36 -36 L -36 50 C -36 66 -20 68 0 68 C 20 68 36 66 36 50 L 36 -36 C 36 -48 36 -64 20 -64 Z",
};

export const SquareNail: NailComponent = (props) => (
  <NailBase shape={squareShape} {...props} />
);
