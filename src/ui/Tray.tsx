import type { StudioDefinition, Tool } from "../core/types";
import { EmojiButton } from "./EmojiButton";
import { RainbowSwatch } from "./RainbowSwatch";
import { ShapeButton } from "./ShapeButton";
import { Swatch } from "./Swatch";

type TrayProps = {
  studio: StudioDefinition;
  tool: Tool;
  onToolChange: (tool: Tool) => void;
};

export function Tray({ studio, tool, onToolChange }: TrayProps) {
  // Picking a shape or color leaves sticker mode; picking the same
  // sticker again toggles back out of it.
  const pickShape = (assetId: string) =>
    onToolChange({ ...tool, assetId, emoji: null });
  const pickColor = (tint: string) =>
    onToolChange({ ...tool, tint, emoji: null });
  const pickSticker = (emoji: string) =>
    onToolChange({ ...tool, emoji: tool.emoji === emoji ? null : emoji });

  return (
    <div className="tray">
      <div className="tray-row" role="group" aria-label="Bead shapes">
        {Object.values(studio.assets).map((asset) => (
          <ShapeButton
            key={asset.id}
            asset={asset}
            tint={tool.tint}
            selected={tool.emoji === null && tool.assetId === asset.id}
            onSelect={pickShape}
          />
        ))}
      </div>
      <div className="tray-row" role="group" aria-label="Colors">
        {studio.palette.map((item) =>
          typeof item === "string" ? (
            <Swatch
              key={item}
              color={item}
              selected={tool.emoji === null && tool.tint === item}
              onSelect={pickColor}
            />
          ) : (
            <RainbowSwatch
              key="rainbow"
              colors={item.rainbow}
              currentTint={tool.tint}
              onSelect={pickColor}
            />
          ),
        )}
      </div>
      {studio.stickers.length > 0 && (
        <div className="tray-row" role="group" aria-label="Stickers">
          {studio.stickers.map((emoji) => (
            <EmojiButton
              key={emoji}
              emoji={emoji}
              selected={tool.emoji === emoji}
              onSelect={pickSticker}
            />
          ))}
        </div>
      )}
    </div>
  );
}
