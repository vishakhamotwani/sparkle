import type { CupcakeAsset } from "./types";

// Scalloped ruffle across the top edge: 7 arcs between x = -96 and 96.
const SCALLOPS = Array.from({ length: 7 }, (_, i) => {
  const step = 192 / 7;
  const to = -96 + (i + 1) * step;
  return `A ${step / 2} ${step / 2} 0 0 1 ${to.toFixed(1)} -65`;
}).join(" ");

/**
 * Paper case: flares wider at the bottom, ruffled scallop edge along
 * the top where the cake peeks out.
 */
export const Wrapper: CupcakeAsset = ({ tint }) => (
  <g>
    <path
      d={`M -124 48 L -96 -65 ${SCALLOPS} L 124 48 Q 126 58 118 61 Q 0 80 -118 61 Q -126 58 -124 48 Z`}
      fill={tint}
      stroke="rgba(0,0,0,0.18)"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    {[-72, -36, 0, 36, 72].map((x) => (
      <path
        key={x}
        d={`M ${x} -58 L ${x * 1.28} ${62 - Math.abs(x) * 0.05}`}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
      />
    ))}
  </g>
);
