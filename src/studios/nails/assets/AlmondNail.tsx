import { NailBase } from "./NailBase";
import type { NailComponent, NailShape } from "./types";

/** Soft tapered tip with full rounded shoulders. */
export const almondShape: NailShape = {
  id: "nail-almond",
  name: "Almond",
  height: 150,
  path: "M 0 -70 C 20 -68 34 -36 36 -4 L 36 55 C 36 72 20 75 0 75 C -20 75 -36 72 -36 55 L -36 -4 C -34 -36 -20 -68 0 -70 Z",
};

export const AlmondNail: NailComponent = (props) => (
  <NailBase shape={almondShape} {...props} />
);
