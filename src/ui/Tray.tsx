import type { StudioDefinition, Tool } from "../core/types";
import { ShapeButton } from "./ShapeButton";
import { Swatch } from "./Swatch";

type TrayProps = {
  studio: StudioDefinition;
  tool: Tool;
  onToolChange: (tool: Tool) => void;
};

export function Tray({ studio, tool, onToolChange }: TrayProps) {
  return (
    <div className="tray">
      <div className="tray-row" role="group" aria-label="Bead shapes">
        {Object.values(studio.assets).map((asset) => (
          <ShapeButton
            key={asset.id}
            asset={asset}
            tint={tool.tint}
            selected={tool.assetId === asset.id}
            onSelect={(assetId) => onToolChange({ ...tool, assetId })}
          />
        ))}
      </div>
      <div className="tray-row" role="group" aria-label="Colors">
        {studio.palette.map((color) => (
          <Swatch
            key={color}
            color={color}
            selected={tool.tint === color}
            onSelect={(tint) => onToolChange({ ...tool, tint })}
          />
        ))}
      </div>
    </div>
  );
}
