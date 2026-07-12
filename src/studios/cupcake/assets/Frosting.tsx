import type { CupcakeAsset } from "./types";

/**
 * Piped swirl: four rounded tiers narrowing upward plus a curl tip.
 * Drawn top-down so each lower tier overlaps the one above, reading
 * as stacked frosting ridges.
 */
export const Frosting: CupcakeAsset = ({ tint }) => {
  const tier = {
    fill: tint,
    stroke: "rgba(0,0,0,0.13)",
    strokeWidth: 3,
  } as const;
  return (
    <g>
      <circle cx={8} cy={-98} r={15} {...tier} />
      <rect x={-52} y={-88} width={104} height={44} rx={22} {...tier} />
      <rect x={-80} y={-48} width={160} height={46} rx={23} {...tier} />
      <rect x={-106} y={-6} width={212} height={46} rx={23} {...tier} />
      <rect x={-132} y={38} width={264} height={46} rx={23} {...tier} />
      <ellipse
        cx={-82}
        cy={54}
        rx={22}
        ry={9}
        fill="white"
        opacity={0.35}
        transform="rotate(-8 -82 54)"
      />
    </g>
  );
};
