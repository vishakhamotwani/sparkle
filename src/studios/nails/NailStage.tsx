import type { Ref } from "react";
import { ombreId } from "../../core/palette";
import type { Design } from "../../core/types";
import { NailBase } from "./assets/NailBase";
import type { PatternId, PlacedGem } from "./assets/types";
import { NAIL_PALETTE, nailStudio, nailTransform, shapeById } from "./config";

type NailStageProps = {
  design: Design;
  activeNail: number | null;
  onNailTap: (n: number) => void;
  onGemTap: (nail: number, anchor: number) => void;
  svgRef?: Ref<SVGSVGElement>;
};

/** Pie-wedge conic pattern for the rainbow tint (mirrors ui/Stage's def). */
function rainbowDef() {
  const rainbow = NAIL_PALETTE.find(
    (item): item is { rainbow: string[] } =>
      typeof item === "object" && "rainbow" in item,
  );
  if (!rainbow) return null;
  const colors = rainbow.rainbow;
  const step = 360 / colors.length;
  return (
    <pattern
      id="rainbow-conic"
      patternUnits="objectBoundingBox"
      width="1"
      height="1"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {colors.map((color, i) => {
        const a0 = ((i * step - 90) * Math.PI) / 180;
        const a1 = (((i + 1) * step - 90) * Math.PI) / 180;
        const d = `M 50 50 L ${50 + 75 * Math.cos(a0)} ${50 + 75 * Math.sin(a0)} A 75 75 0 0 1 ${50 + 75 * Math.cos(a1)} ${50 + 75 * Math.sin(a1)} Z`;
        return <path key={color} d={d} fill={color} />;
      })}
    </pattern>
  );
}

/** The nail studio's own stage: five fingertips fanned in an arc. */
export function NailStage({
  design,
  activeNail,
  onNailTap,
  onGemTap,
  svgRef,
}: NailStageProps) {
  const bySlot = new Map(design.placements.map((p) => [p.slotId, p]));
  const ombres = NAIL_PALETTE.filter(
    (item): item is { ombre: [string, string] } =>
      typeof item === "object" && "ombre" in item,
  );

  return (
    <svg
      ref={svgRef}
      className="stage"
      viewBox={`0 0 ${nailStudio.stage.width} ${nailStudio.stage.height}`}
      role="img"
      aria-label={nailStudio.name}
    >
      <defs>
        {rainbowDef()}
        {ombres.map(({ ombre: [from, to] }) => (
          <linearGradient
            key={ombreId(from, to)}
            id={ombreId(from, to)}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        ))}
      </defs>
      {Array.from({ length: 5 }, (_, n) => {
        const nail = bySlot.get(`nail-${n}`);
        if (!nail) return null;
        const shape = shapeById(nail.assetId);
        const pattern = bySlot.get(`pattern-${n}`);
        const gems: PlacedGem[] = [];
        for (let a = 0; a < 5; a++) {
          const g = bySlot.get(`gem-${n}-${a}`);
          if (g) {
            const [, gemShape, gemSize] = g.assetId.split("-");
            gems.push({
              anchor: a,
              shape: gemShape as PlacedGem["shape"],
              size: gemSize as PlacedGem["size"],
              tint: g.tint ?? "#FFD700",
            });
          }
        }
        const { x, y, rotation, scale } = nailTransform(n);
        return (
          <g
            key={n}
            className="slot"
            transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}
            onPointerDown={() => onNailTap(n)}
          >
            <NailBase
              shape={shape}
              tint={nail.tint ?? "#F0D3CB"}
              pattern={
                pattern
                  ? (pattern.assetId.replace("pattern-", "") as PatternId)
                  : undefined
              }
              glitter={nail.glitter}
              gems={gems}
              selected={activeNail === n}
              onGemTap={(anchor) => onGemTap(n, anchor)}
            />
            {/* Generous hit area for small fingers. */}
            <rect
              x={-52}
              y={-shape.height / 2 - 16}
              width={104}
              height={shape.height + 32}
              fill="none"
              pointerEvents="all"
              data-export-hide
            />
          </g>
        );
      })}
    </svg>
  );
}
