import type { BeadAsset } from "./types";

/**
 * Knot at the origin (sits on the string, behind any bead there), strands
 * hanging well below so they clear the bottom bead entirely.
 */
export const Tassel: BeadAsset = ({ tint }) => (
  <g>
    <g
      fill="none"
      stroke={tint}
      strokeWidth={5.5}
      strokeLinecap="round"
      opacity={0.95}
    >
      <path d="M 0 6 C -10 40 -22 80 -26 118" />
      <path d="M 0 6 C -5 42 -12 88 -13 124" />
      <path d="M 0 6 C 0 44 0 92 0 128" />
      <path d="M 0 6 C 5 42 12 88 13 124" />
      <path d="M 0 6 C 10 40 22 80 26 118" />
    </g>
    <circle r={10} fill={tint} stroke="rgba(0,0,0,0.18)" strokeWidth={2.5} />
  </g>
);
