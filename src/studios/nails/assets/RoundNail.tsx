import { NailBase } from "./NailBase";
import type { NailComponent, NailShape } from "./types";

/** Shorter, more circular tip with generous rounding. */
export const roundShape: NailShape = {
  id: "nail-round",
  name: "Round",
  height: 110,
  path: "M -36 -2 C -36 -36 -24 -55 0 -55 C 24 -55 36 -36 36 -2 L 36 35 C 36 51 20 55 0 55 C -20 55 -36 51 -36 35 Z",
};

export const RoundNail: NailComponent = (props) => (
  <NailBase shape={roundShape} {...props} />
);
