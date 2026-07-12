import type { CupcakeAsset } from "./types";

// x, y, rotation — scattered inside the frosting silhouette.
const SPRINKLES: [number, number, number][] = [
  [-70, 52, 30],
  [-20, 58, -20],
  [40, 50, 15],
  [92, 56, -35],
  [-88, 14, 10],
  [-40, 8, 40],
  [20, 12, -15],
  [68, 6, 25],
  [-55, -30, -30],
  [0, -26, 20],
  [46, -34, -10],
  [-26, -66, 15],
  [22, -70, -25],
  [2, -96, 35],
];

/** Little sugar strands sprinkled over the frosting. */
export const Sprinkles: CupcakeAsset = ({ tint }) => (
  <g>
    {SPRINKLES.map(([x, y, deg], i) => (
      <rect
        key={i}
        x={-8}
        y={-2.5}
        width={16}
        height={5}
        rx={2.5}
        fill={tint}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth={1}
        transform={`translate(${x} ${y}) rotate(${deg})`}
      />
    ))}
  </g>
);
