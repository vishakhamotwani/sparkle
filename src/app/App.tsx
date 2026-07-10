import { useState } from "react";
import type { Tool } from "../core/types";
import { useDesign } from "../core/useDesign";
import { Stage } from "../ui/Stage";
import { StudioShell } from "../ui/StudioShell";
import { ToolbarButton } from "../ui/ToolbarButton";
import { Tray } from "../ui/Tray";
import { getStudio } from "./registry";

export default function App() {
  const studio = getStudio("bracelet");
  const { design, canUndo, place, undo, reset } = useDesign(studio.id);
  const [tool, setTool] = useState<Tool>(() => ({
    assetId: Object.keys(studio.assets)[0],
    tint: studio.palette[0],
  }));

  return (
    <StudioShell
      title={`✨ ${studio.name}`}
      toolbar={
        <>
          <ToolbarButton
            label="Undo"
            icon="↩️"
            disabled={!canUndo}
            onPress={undo}
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
          onSlotTap={(slotId) =>
            place({ slotId, assetId: tool.assetId, tint: tool.tint })
          }
        />
      }
      tray={<Tray studio={studio} tool={tool} onToolChange={setTool} />}
    />
  );
}
