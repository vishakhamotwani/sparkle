import { NailBase } from "./NailBase";
import type { NailComponent, NailShape } from "./types";

/**
 * Pointed tip with a clear teardrop belly — sides bow outward past
 * full width, then settle. Reads as curved-out, never pinched in.
 */
export const stilettoShape: NailShape = {
  id: "nail-stiletto",
  name: "Stiletto",
  height: 155,
  path: "M 0 -82 C 28 -72 42 -32 36 2 L 36 58 C 36 74 20 78 0 78 C -20 78 -36 74 -36 58 L -36 2 C -42 -32 -28 -72 0 -82 Z",
};

export const StilettoNail: NailComponent = (props) => (
  <NailBase shape={stilettoShape} {...props} />
);
