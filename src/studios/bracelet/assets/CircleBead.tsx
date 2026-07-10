import type { BeadAsset } from "./types";

export const CircleBead: BeadAsset = ({ tint }) => (
  <g>
    <circle r={46} fill={tint} stroke="rgba(0,0,0,0.18)" strokeWidth={3} />
    <ellipse
      cx={-15}
      cy={-19}
      rx={15}
      ry={9}
      fill="white"
      opacity={0.45}
      transform="rotate(-32 -15 -19)"
    />
  </g>
);
