import type { NailShape, PlacedGem } from "./types";

const SIZE_R = { sm: 6.5, md: 9.5, lg: 13 } as const;

/** Anchor spots on a nail, scaled to its length. */
export function gemAnchors(shape: NailShape): [number, number][] {
  const h = shape.height;
  return [
    [0, -h * 0.24],
    [0, 0],
    [0, h * 0.24],
    [-15, -h * 0.05],
    [15, -h * 0.05],
  ];
}

function Gem({ gem, r }: { gem: PlacedGem; r: number }) {
  const stroke = "rgba(0,0,0,0.25)";
  switch (gem.shape) {
    case "circle":
      return (
        <>
          <circle r={r} fill={gem.tint} stroke={stroke} strokeWidth={1.5} />
          <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.28} fill="white" opacity={0.8} />
        </>
      );
    case "teardrop":
      return (
        <>
          <path
            d={`M 0 ${-r * 1.4} C ${r * 0.9} ${-r * 0.3} ${r * 0.85} ${r * 0.5} 0 ${r} C ${-r * 0.85} ${r * 0.5} ${-r * 0.9} ${-r * 0.3} 0 ${-r * 1.4} Z`}
            fill={gem.tint}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <circle cx={-r * 0.2} cy={-r * 0.1} r={r * 0.25} fill="white" opacity={0.8} />
        </>
      );
    case "star": {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const radius = i % 2 === 0 ? r * 1.25 : r * 0.55;
        const a = (i * 36 - 90) * (Math.PI / 180);
        return `${(radius * Math.cos(a)).toFixed(1)},${(radius * Math.sin(a)).toFixed(1)}`;
      }).join(" ");
      return (
        <polygon points={pts} fill={gem.tint} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
      );
    }
    case "heart":
      return (
        <path
          d={`M 0 ${r} C ${-r * 0.3} ${r * 0.7} ${-r * 1.2} ${r * 0.2} ${-r * 1.2} ${-r * 0.35} C ${-r * 1.2} ${-r} ${-r * 0.3} ${-r * 1.05} 0 ${-r * 0.45} C ${r * 0.3} ${-r * 1.05} ${r * 1.2} ${-r} ${r * 1.2} ${-r * 0.35} C ${r * 1.2} ${r * 0.2} ${r * 0.3} ${r * 0.7} 0 ${r} Z`}
          fill={gem.tint}
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      );
  }
}

/** Placed gems on a nail, each with a comfortable tap target. */
export function GemOverlay({
  shape,
  gems,
  onGemTap,
}: {
  shape: NailShape;
  gems: PlacedGem[];
  onGemTap?: (anchor: number) => void;
}) {
  const anchors = gemAnchors(shape);
  return (
    <g>
      {gems.map((gem) => {
        const [x, y] = anchors[gem.anchor] ?? [0, 0];
        return (
          <g
            key={gem.anchor}
            transform={`translate(${x} ${y})`}
            onPointerDown={
              onGemTap
                ? (e) => {
                    e.stopPropagation();
                    onGemTap(gem.anchor);
                  }
                : undefined
            }
          >
            <Gem gem={gem} r={SIZE_R[gem.size]} />
            <circle r={16} fill="none" pointerEvents="all" data-export-hide />
          </g>
        );
      })}
    </g>
  );
}
