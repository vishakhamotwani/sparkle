import type { Design, Slot, StudioDefinition } from "../core/types";

type StageProps = {
  studio: StudioDefinition;
  design: Design;
  onSlotTap: (slotId: string) => void;
};

function slotTransform(slot: Slot): string {
  let t = `translate(${slot.x} ${slot.y})`;
  if (slot.rotation) t += ` rotate(${slot.rotation})`;
  if (slot.scale) t += ` scale(${slot.scale})`;
  return t;
}

export function Stage({ studio, design, onSlotTap }: StageProps) {
  const bySlot = new Map(design.placements.map((p) => [p.slotId, p]));

  return (
    <svg
      className="stage"
      viewBox={`0 0 ${studio.stage.width} ${studio.stage.height}`}
      role="img"
      aria-label={studio.name}
    >
      {studio.stage.background}
      {studio.slots.map((slot) => {
        const placement = bySlot.get(slot.id);
        const asset = placement ? studio.assets[placement.assetId] : undefined;
        const BeadComponent = asset?.component;

        return (
          <g
            key={slot.id}
            className="slot"
            transform={slotTransform(slot)}
            onPointerDown={() => onSlotTap(slot.id)}
          >
            {BeadComponent && placement ? (
              // Remount on any change so the pop animation replays.
              <g key={`${placement.assetId}-${placement.tint}`} className="pop">
                <BeadComponent tint={placement.tint ?? "#cccccc"} />
              </g>
            ) : (
              <circle className="slot-ghost" r={38} />
            )}
            {/* Round hit area so hearts/stars are as easy to tap as circles. */}
            <circle r={54} fill="none" pointerEvents="all" />
          </g>
        );
      })}
    </svg>
  );
}
