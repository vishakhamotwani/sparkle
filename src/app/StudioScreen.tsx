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
  const { design, canUndo, place, undo, reset } = useDesign(
    studio.id,
    loadPlacements(studio),
  );
  const [tool, setTool] = useState<Tool>(() => ({
    assetId: Object.keys(studio.assets)[0],
    tint: typeof studio.palette[0] === "string" ? studio.palette[0] : "#FF6FB5",
    emoji: null,
  }));
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    saveDesign(design);
  }, [design]);

  const handleSlotTap = (slotId: string) => {
    const existing = design.placements.find((p) => p.slotId === slotId);
    if (tool.emoji) {
      // Sticker mode: decorate the existing bead, or place one to stick it on.
      place(
        existing
          ? { ...existing, emoji: tool.emoji }
          : {
              slotId,
              assetId: tool.assetId,
              tint: tool.tint,
              emoji: tool.emoji,
            },
      );
    } else {
      // Bead mode: place/recolor, keeping any sticker already there.
      place({
        slotId,
        assetId: tool.assetId,
        tint: tool.tint,
        emoji: existing?.emoji,
      });
    }
  };

  const handleSave = () => {
    if (svgRef.current) {
      void exportStagePng(svgRef.current, `sparkle-${studio.id}.png`);
    }
  };

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
            disabled={design.placements.length === 0}
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
