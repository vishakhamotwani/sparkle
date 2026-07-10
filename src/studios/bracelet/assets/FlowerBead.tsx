import type { BeadAsset } from "./types";

const PETALS = [
  { cx: 0, cy: -26 },
  { cx: 24.7, cy: -8 },
  { cx: 15.3, cy: 21 },
  { cx: -15.3, cy: 21 },
  { cx: -24.7, cy: -8 },
];

export const FlowerBead: BeadAsset = ({ tint }) => (
  <g>
    {PETALS.map(({ cx, cy }) => (
      <circle
        key={`${cx},${cy}`}
        cx={cx}
        cy={cy}
        r={20}
        fill={tint}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={2.5}
      />
    ))}
    <circle r={15} fill="#FFF3C7" stroke="rgba(0,0,0,0.15)" strokeWidth={2.5} />
  </g>
);
