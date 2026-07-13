import { NailBase } from "./NailBase";
import type { NailComponent, NailShape } from "./types";

/** Classic rounded tip — full semicircle feel, soft all the way around. */
export const ovalShape: NailShape = {
  id: "nail-oval",
  name: "Oval",
  height: 140,
  path: "M -36 -14 C -36 -48 -24 -70 0 -70 C 24 -70 36 -48 36 -14 L 36 50 C 36 66 20 70 0 70 C -20 70 -36 66 -36 50 Z",
};

export const OvalNail: NailComponent = (props) => (
  <NailBase shape={ovalShape} {...props} />
);
