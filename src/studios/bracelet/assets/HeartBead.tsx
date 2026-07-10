import type { BeadAsset } from "./types";

export const HeartBead: BeadAsset = ({ tint }) => (
  <g>
    <path
      d="M 0 42
         C -10 32 -46 10 -46 -14
         C -46 -34 -29 -43 -15 -38
         C -6 -35 -2 -28 0 -21
         C 2 -28 6 -35 15 -38
         C 29 -43 46 -34 46 -14
         C 46 10 10 32 0 42 Z"
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <ellipse
      cx={-20}
      cy={-18}
      rx={10}
      ry={7}
      fill="white"
      opacity={0.45}
      transform="rotate(-38 -20 -18)"
    />
  </g>
);
