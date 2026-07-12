import type { CupcakeAsset } from "./types";

/**
 * Piped swirl: one tapering cone silhouette with gentle scalloped
 * shoulders and a rounded peak, plus spiral wrap lines on the surface.
 */
export const Frosting: CupcakeAsset = ({ tint }) => (
  <g>
    <path
      d="M -113 82
         C -121 60 -111 48 -92 42
         C -102 22 -92 10 -72 4
         C -83 -16 -72 -28 -53 -34
         C -62 -52 -53 -64 -35 -68
         C -40 -92 -25 -108 -2 -108
         C 21 -108 37 -92 32 -68
         C 49 -64 58 -52 49 -34
         C 69 -28 79 -16 69 4
         C 88 10 99 22 88 42
         C 107 48 118 60 109 82
         Q 0 94 -113 82
         Z"
      fill={tint}
      stroke="rgba(0,0,0,0.13)"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    {/* Spiral wrap lines */}
    <g
      fill="none"
      stroke="rgba(0,0,0,0.1)"
      strokeWidth={4}
      strokeLinecap="round"
    >
      <path d="M -88 42 Q -7 62 86 44" />
      <path d="M -69 4 Q -4 22 65 6" />
      <path d="M -49 -34 Q -2 -18 46 -32" />
      <path d="M -32 -68 Q 2 -56 28 -66" />
    </g>
    <ellipse
      cx={-64}
      cy={56}
      rx={20}
      ry={8}
      fill="white"
      opacity={0.35}
      transform="rotate(-10 -64 56)"
    />
  </g>
);
