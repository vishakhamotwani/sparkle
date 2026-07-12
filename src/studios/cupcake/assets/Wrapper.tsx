import type { CupcakeAsset } from "./types";

/** Fluted paper case: trapezoid with vertical stripes and a top rim. */
export const Wrapper: CupcakeAsset = ({ tint }) => (
  <g>
    <path
      d="M -118 -63 L 118 -63 L 86 58 Q 0 74 -86 58 Z"
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    {[-80, -40, 0, 40, 80].map((x) => (
      <path
        key={x}
        d={`M ${x} -58 L ${x * 0.72} ${60 - Math.abs(x) * 0.06}`}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
      />
    ))}
    <rect
      x={-123}
      y={-71}
      width={246}
      height={15}
      rx={7.5}
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
    />
  </g>
);
