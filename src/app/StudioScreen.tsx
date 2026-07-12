import { useCallback, useEffect, useRef, useState } from "react";
import { Celebration } from "../ui/Celebration";
import { exportStagePng } from "../core/export";
import {
  clearBackup,
  loadBackup,
  loadPlacements,
  saveDesign,
} from "../core/storage";
import type { Placement, Tool } from "../core/types";
import { useDesign } from "../core/useDesign";
import { Stage } from "../ui/Stage";
import { StudioShell } from "../ui/StudioShell";
import { ToolbarButton } from "../ui/ToolbarButton";
import { Tray } from "../ui/Tray";
import { RestorePrompt } from "../ui/RestorePrompt";
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
  const { design, canUndo, place, clearSlot, undo, reset, load } = useDesign(
    studio.id,
    initial,
    base,
  );
  // If the save came up empty but a previous design is backed up, offer it.
  const [backupOffer, setBackupOffer] = useState<Placement[] | null>(() => {
    if (saved.length > 0) return null;
    const backup = loadBackup(studio);
    return backup.length > 0 ? backup : null;
  });
  const [tool, setTool] = useState<Tool>(() => ({
    assetId: Object.values(studio.assets).find((a) => !a.fixed)!.id,
    tint: typeof studio.palette[0] === "string" ? studio.palette[0] : "#FF6FB5",
    emoji: null,
    glitter: false,
  }));
  const [celebrating, setCelebrating] = useState(false);
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
      if (existing && !tool.emoji && !tool.glitter) {
        place({ ...existing, tint: tool.tint });
      }
      return;
    }
    if (tool.glitter) {
      // Glitter mode: toggle shimmer per bead; empty slots get a
      // glittery bead in the current shape and color.
      if (existing) {
        place({ ...existing, glitter: existing.glitter ? undefined : true });
      } else {
        place({
          slotId,
          assetId: tool.assetId,
          tint: tool.tint,
          glitter: true,
        });
      }
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
      // Bead mode: place/recolor, keeping glitter and keeping a sticker
      // only if the new shape can carry it.
      place({
        slotId,
        assetId: tool.assetId,
        tint: tool.tint,
        emoji: studio.assets[tool.assetId].stickerable
          ? existing?.emoji
          : undefined,
        glitter: existing?.glitter,
      });
    }
  };

  // Save = a short celebration, then the actual PNG download.
  const handleSave = () => {
    if (svgRef.current && !celebrating) setCelebrating(true);
  };

  const finishCelebration = useCallback(() => {
    if (svgRef.current) {
      void exportStagePng(svgRef.current, `sparkle-${studioId}.png`);
    }
    setCelebrating(false);
  }, [studioId]);

  const isPristine = JSON.stringify(design.placements) === JSON.stringify(base);

  const extras = (studio.toggleables ?? []).map(
    ({ slotId, assetId, label }) => {
      const active = design.placements.some((p) => p.slotId === slotId);
      return {
        id: slotId,
        label: active ? `Remove ${label}` : `Add ${label}`,
        active,
        component: studio.assets[assetId].component,
        onToggle: () =>
          active
            ? clearSlot(slotId)
            : place({ slotId, assetId, tint: tool.tint }),
      };
    },
  );

  return (
    <>
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
              disabled={design.placements.length === 0 || celebrating}
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
            stickerMode={tool.emoji !== null}
          />
        }
        tray={
          <Tray
            studio={studio}
            tool={tool}
            onToolChange={setTool}
            extras={extras}
          />
        }
      />
      {celebrating && <Celebration onDone={finishCelebration} />}
      {backupOffer && (
        <RestorePrompt
          creationName={studio.creationName ?? "creation"}
          onYes={() => {
            load(backupOffer);
            setBackupOffer(null);
          }}
          onNo={() => {
            clearBackup(studio.id);
            setBackupOffer(null);
          }}
        />
      )}
    </>
  );
}
