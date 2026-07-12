import type { CupcakeAsset } from "./types";

// Scalloped ruffle across the wide top opening: 8 arcs, x = -128..128.
const SCALLOPS = Array.from({ length: 8 }, (_, i) => {
  const step = 256 / 8;
  const to = -128 + (i + 1) * step;
  return `A ${step / 2} ${step / 2} 0 0 1 ${to.toFixed(1)} -65`;
}).join(" ");

/**
 * Classic paper case: wide open top that holds the cake generously,
 * flaring even wider at the bottom, ruffled scallop edge on top.
 */
export const Wrapper: CupcakeAsset = ({ tint }) => (
  <g>
    <path
      d={`M -146 48 L -128 -65 ${SCALLOPS} L 146 48 Q 148 58 140 61 Q 0 80 -140 61 Q -148 58 -146 48 Z`}
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    {[-96, -48, 0, 48, 96].map((x) => (
      <path
        key={x}
        d={`M ${x} -58 L ${x * 1.14} ${62 - Math.abs(x) * 0.04}`}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
      />
    ))}
  </g>
);
