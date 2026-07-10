import { useEffect, useRef, useState } from "react";
import { exportStagePng } from "../core/export";
import { loadPlacements, saveDesign } from "../core/storage";
import type { Tool } from "../core/types";
import { useDesign } from "../core/useDesign";
import { Stage } from "../ui/Stage";
import { StudioShell } from "../ui/StudioShell";
import { ToolbarButton } from "../ui/ToolbarButton";
import { Tray } from "../ui/Tray";
import { getStudio } from "./registry";

type StudioScreenProps = {
  studioId: string;
  onBack: () => void;
};

export function StudioScreen({ studioId, onBack }: StudioScreenProps) {
  const studio = getStudio(studioId);
  const base = studio.initialPlacements ?? [];
  // Restore the saved design, backfilling scene placements (tassels) that a
  // save from an older version won't have.
  const saved = loadPlacements(studio);
  const initial = [
    ...saved,
    ...base.filter((p) => !saved.some((s) => s.slotId === p.slotId)),
  ];
  const { design, canUndo, place, undo, reset } = useDesign(
    studio.id,
    initial,
    base,
  );
  const [tool, setTool] = useState<Tool>(() => ({
    assetId: Object.values(studio.assets).find((a) => !a.fixed)!.id,
    tint: typeof studio.palette[0] === "string" ? studio.palette[0] : "#FF6FB5",
    emoji: null,
  }));
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    saveDesign(design);
  }, [design]);

  const handleSlotTap = (slotId: string) => {
    const slot = studio.slots.find((s) => s.id === slotId);
    if (!slot) return;
    const existing = design.placements.find((p) => p.slotId === slotId);

    // Slots that don't take the current tool's asset (tassels): any color
    // tap just recolors what's there.
    if (!slot.accepts.includes(studio.assets[tool.assetId].category)) {
      if (existing && !tool.emoji) place({ ...existing, tint: tool.tint });
      return;
    }
    if (tool.emoji) {
      // Sticker mode: only stickerable assets (circle beads) take stickers.
      if (existing) {
        if (studio.assets[existing.assetId].stickerable) {
          place({ ...existing, emoji: tool.emoji });
        }
        return;
      }
      // Empty slot: place a stickerable bead to stick it on.
      const stickerBase = Object.values(studio.assets).find(
        (a) => a.stickerable && slot.accepts.includes(a.category),
      );
      if (stickerBase) {
        place({
          slotId,
          assetId: stickerBase.id,
          tint: tool.tint,
          emoji: tool.emoji,
        });
      }
    } else {
      // Bead mode: place/recolor, keeping a sticker only if the new shape
      // can carry it.
      place({
        slotId,
        assetId: tool.assetId,
        tint: tool.tint,
        emoji: studio.assets[tool.assetId].stickerable
          ? existing?.emoji
          : undefined,
      });
    }
  };

  const handleSave = () => {
    if (svgRef.current) {
      void exportStagePng(svgRef.current, `sparkle-${studio.id}.png`);
    }
  };

  const isPristine =
    JSON.stringify(design.placements) === JSON.stringify(base);

  return (
    <StudioShell
      title={studio.name}
      onBack={onBack}
      toolbar={
        <>
          <ToolbarButton
            label="Undo"
            icon="↩️"
            disabled={!canUndo}
            onPress={undo}
          />
          <ToolbarButton
            label="Save"
            icon="📸"
            disabled={design.placements.length === 0}
            onPress={handleSave}
          />
          <ToolbarButton
            label="Start over"
            icon="🌈"
            disabled={isPristine}
            onPress={reset}
          />
        </>
      }
      stage={
        <Stage
          studio={studio}
          design={design}
          onSlotTap={handleSlotTap}
          svgRef={svgRef}
        />
      }
      tray={<Tray studio={studio} tool={tool} onToolChange={setTool} />}
    />
  );
}
