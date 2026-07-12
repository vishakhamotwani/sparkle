import type { Ref } from "react";
import { ombreId } from "../core/palette";
import type { Design, Slot, StudioDefinition } from "../core/types";

/** Pie-wedge paths approximating a conic gradient inside a 100×100 box. */
function rainbowWedges(colors: string[]) {
  const step = 360 / colors.length;
  return colors.map((color, i) => {
    // Radius 75 comfortably covers the box corners; -90° starts at 12 o'clock.
    const a0 = ((i * step - 90) * Math.PI) / 180;
    const a1 = (((i + 1) * step - 90) * Math.PI) / 180;
    const d = `M 50 50 L ${50 + 75 * Math.cos(a0)} ${50 + 75 * Math.sin(a0)} A 75 75 0 0 1 ${50 + 75 * Math.cos(a1)} ${50 + 75 * Math.sin(a1)} Z`;
    return <path key={color} d={d} fill={color} />;
  });
}

type StageProps = {
  studio: StudioDefinition;
  design: Design;
  onSlotTap: (slotId: string) => void;
  svgRef?: Ref<SVGSVGElement>;
  /** Sticker selected: glow the valid sticker targets, dim everything else. */
  stickerMode?: boolean;
};

// A tiny four-point sparkle centered on (0,0), ~12 units across.
const SPARK_PATH =
  "M 0 -6 L 1.6 -1.6 L 6 0 L 1.6 1.6 L 0 6 L -1.6 1.6 L -6 0 L -1.6 -1.6 Z";

// Fixed sparkle layout inside a bead: x, y, scale.
const SPARKS: [number, number, number][] = [
  [-16, -14, 1.0],
  [12, -18, 1.3],
  [22, 6, 0.8],
  [-4, 2, 1.5],
  [-24, 12, 0.9],
  [8, 20, 1.1],
  [-10, 26, 0.7],
];

function slotTransform(slot: Slot): string {
  let t = `translate(${slot.x} ${slot.y})`;
  if (slot.rotation) t += ` rotate(${slot.rotation})`;
  if (slot.scale) t += ` scale(${slot.scale})`;
  return t;
}

export function Stage({
  studio,
  design,
  onSlotTap,
  svgRef,
  stickerMode = false,
}: StageProps) {
  const bySlot = new Map(design.placements.map((p) => [p.slotId, p]));
  const stickerableCategories = new Set(
    Object.values(studio.assets)
      .filter((a) => a.stickerable)
      .map((a) => a.category),
  );
  const ombres = studio.palette.filter(
    (item): item is { ombre: [string, string] } =>
      typeof item === "object" && "ombre" in item,
  );
  const rainbow = studio.palette.find(
    (item): item is { rainbow: string[] } =>
      typeof item === "object" && "rainbow" in item,
  );

  return (
    <svg
      ref={svgRef}
      className="stage"
      viewBox={`0 0 ${studio.stage.width} ${studio.stage.height}`}
      role="img"
      aria-label={studio.name}
    >
      {(ombres.length > 0 || rainbow) && (
        <defs>
          {rainbow && (
            <pattern
              id="rainbow-conic"
              patternUnits="objectBoundingBox"
              width="1"
              height="1"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {rainbowWedges(rainbow.rainbow)}
            </pattern>
          )}
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
      )}
      {studio.stage.background}
      {studio.slots.map((slot) => {
        const placement = bySlot.get(slot.id);
        const asset = placement ? studio.assets[placement.assetId] : undefined;
        const BeadComponent = asset?.component;
        // A sticker can land here if a stickerable asset is present, or the
        // empty slot would receive one to carry it.
        const isStickerTarget = placement
          ? !!asset?.stickerable
          : slot.accepts.some((c) => stickerableCategories.has(c));
        const modeClass = !stickerMode
          ? ""
          : isStickerTarget
            ? " slot-target"
            : " slot-dim";

        return (
          <g
            key={slot.id}
            className={`slot${modeClass}`}
            transform={slotTransform(slot)}
            onPointerDown={() => onSlotTap(slot.id)}
          >
            {BeadComponent && placement ? (
              // Remount on any change so the pop animation replays.
              <g
                key={`${placement.assetId}-${placement.tint}-${placement.emoji}-${placement.glitter}`}
                className="pop"
              >
                <BeadComponent tint={placement.tint ?? "#cccccc"} />
                {placement.glitter && (
                  <g>
                    {SPARKS.map(([x, y, s], i) => (
                      <path
                        key={i}
                        className="glitter-spark"
                        d={SPARK_PATH}
                        transform={`translate(${x} ${y}) scale(${s})`}
                        fill="#ffffff"
                        opacity={0.9}
                      />
                    ))}
                  </g>
                )}
                {placement.emoji && (
                  // Counter-rotate so stickers stay upright all around the curve.
                  <g transform={`rotate(${-(slot.rotation ?? 0)})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={46}
                      fontFamily="sans-serif"
                    >
                      {placement.emoji}
                    </text>
                  </g>
                )}
              </g>
            ) : (
              !slot.hideGhost && (
                <circle className="slot-ghost" r={38} data-export-hide />
              )
            )}
            {stickerMode && isStickerTarget && (
              <circle className="slot-glow" r={46} data-export-hide />
            )}
            {/* Round hit area so hearts/stars are as easy to tap as circles. */}
            <circle r={54} fill="none" pointerEvents="all" data-export-hide />
          </g>
        );
      })}
    </svg>
  );
}
