import type { Ref } from "react";
import { ombreId } from "../core/palette";
import type { Design, Slot, StudioDefinition } from "../core/types";

type StageProps = {
  studio: StudioDefinition;
  design: Design;
  onSlotTap: (slotId: string) => void;
  svgRef?: Ref<SVGSVGElement>;
  /** Sticker selected: glow the valid sticker targets, dim everything else. */
  stickerMode?: boolean;
};

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

  return (
    <svg
      ref={svgRef}
      className="stage"
      viewBox={`0 0 ${studio.stage.width} ${studio.stage.height}`}
      role="img"
      aria-label={studio.name}
    >
      {ombres.length > 0 && (
        <defs>
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
                key={`${placement.assetId}-${placement.tint}-${placement.emoji}`}
                className="pop"
              >
                <BeadComponent tint={placement.tint ?? "#cccccc"} />
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
