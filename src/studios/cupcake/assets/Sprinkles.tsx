import type { CupcakeAsset } from "./types";

/** Sentinel tint: each sprinkle takes its own color from the mix. */
export const SPRINKLE_MIX = "mix";

const MIX_COLORS = [
  "#FF6FB5",
  "#FFD93D",
  "#4D96FF",
  "#6BCB77",
  "#B983FF",
  "#FF5A5F",
  "#4DD4E8",
];

// x, y, rotation — scattered irregularly inside the frosting cone
// (positions hug the taper: wide near the base, narrow near the tip).
const SPRINKLES: [number, number, number][] = [
  [-92, 58, 24],
  [-62, 44, -48],
  [-18, 64, 12],
  [34, 48, 74],
  [78, 60, -22],
  [96, 50, 40],
  [-80, 16, -70],
  [-34, 24, 33],
  [12, 10, -12],
  [58, 22, 58],
  [80, 12, -40],
  [-58, -16, 15],
  [-8, -24, -62],
  [42, -14, 28],
  [-38, -52, -20],
  [8, -46, 44],
  [34, -56, -35],
  [-14, -84, 20],
  [16, -92, -50],
];

/** Sugar strands over the frosting — a color mix unless a tint is picked. */
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
        fill={tint === SPRINKLE_MIX ? MIX_COLORS[i % MIX_COLORS.length] : tint}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth={1}
        transform={`translate(${x} ${y}) rotate(${deg})`}
      />
    ))}
  </g>
);
