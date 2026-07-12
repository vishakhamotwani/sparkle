import type { CupcakeAsset } from "./types";

/** Five-point star topper. */
export const StarTopper: CupcakeAsset = ({ tint }) => (
  <g>
    <polygon
      points="0,-36 9.2,-12.8 34.2,-11.1 15,4.9 21.2,29.1 0,15.8 -21.2,29.1 -15,4.9 -34.2,-11.1 -9.2,-12.8"
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <ellipse
      cx={-6}
      cy={-12}
      rx={6}
      ry={4}
      fill="white"
      opacity={0.5}
      transform="rotate(-30 -6 -12)"
    />
  </g>
);
