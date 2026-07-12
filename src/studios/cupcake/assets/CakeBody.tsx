import type { CupcakeAsset } from "./types";

/** The baked cake peeking out between wrapper and frosting. */
export const CakeBody: CupcakeAsset = ({ tint }) => (
  <g>
    <rect
      x={-108}
      y={-34}
      width={216}
      height={68}
      rx={30}
      fill={tint}
      stroke="rgba(0,0,0,0.15)"
      strokeWidth={3}
    />
  </g>
);
