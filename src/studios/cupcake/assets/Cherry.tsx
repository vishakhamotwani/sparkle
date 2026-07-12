import type { CupcakeAsset } from "./types";

/** Classic cherry on top — fixed colors, ignores tint. */
export const Cherry: CupcakeAsset = () => (
  <g>
    <path
      d="M 4 -10 Q 12 -34 30 -42"
      fill="none"
      stroke="#4C9A2A"
      strokeWidth={5}
      strokeLinecap="round"
    />
    <circle
      cy={12}
      r={24}
      fill="#E5484D"
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
    />
    <ellipse
      cx={-8}
      cy={3}
      rx={8}
      ry={5}
      fill="white"
      opacity={0.5}
      transform="rotate(-30 -8 3)"
    />
  </g>
);
