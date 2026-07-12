import type { CupcakeAsset } from "./types";

/** Birthday candle with a warm flame; the stick takes the tint. */
export const Candle: CupcakeAsset = ({ tint }) => (
  <g>
    <ellipse cx={0} cy={-42} rx={10} ry={16} fill="#FFB13D" />
    <ellipse cx={0} cy={-39} rx={5.5} ry={9} fill="#FFE27A" />
    <line
      x1={0}
      y1={-28}
      x2={0}
      y2={-20}
      stroke="#5c4457"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
    <rect
      x={-9}
      y={-20}
      width={18}
      height={66}
      rx={6}
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
    />
    <path
      d="M -9 -6 L 9 -14 M -9 14 L 9 6 M -9 34 L 9 26"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth={5}
      strokeLinecap="round"
    />
  </g>
);
