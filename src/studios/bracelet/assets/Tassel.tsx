import type { BeadAsset } from "./types";

/**
 * Hangs straight down from its slot: knot at the top (on the string),
 * five strands fanning below.
 */
export const Tassel: BeadAsset = ({ tint }) => (
  <g>
    <g
      fill="none"
      stroke={tint}
      strokeWidth={5}
      strokeLinecap="round"
      opacity={0.95}
    >
      <path d="M 0 -41 C -8 -22 -16 8 -19 38" />
      <path d="M 0 -41 C -4 -20 -9 12 -10 41" />
      <path d="M 0 -41 C 0 -18 0 16 0 43" />
      <path d="M 0 -41 C 4 -20 9 12 10 41" />
      <path d="M 0 -41 C 8 -22 16 8 19 38" />
    </g>
    <circle
      cy={-45}
      r={9}
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={2.5}
    />
  </g>
);
