import type { BeadAsset } from "./types";

export const StarBead: BeadAsset = ({ tint }) => (
  <g>
    <polygon
      points="0,-48 12.3,-17 45.7,-14.8 20,6.5 28.2,38.8 0,21 -28.2,38.8 -20,6.5 -45.7,-14.8 -12.3,-17"
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <ellipse
      cx={-8}
      cy={-16}
      rx={8}
      ry={5}
      fill="white"
      opacity={0.5}
      transform="rotate(-30 -8 -16)"
    />
  </g>
);
