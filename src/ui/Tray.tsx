import type { ComponentType } from "react";
import { ombreTint } from "../core/palette";
import type { AssetProps, StudioDefinition, Tool } from "../core/types";
import { CustomColorSwatch } from "./CustomColorSwatch";
import { EmojiButton } from "./EmojiButton";
import { ExtraButton } from "./ExtraButton";
import { OmbreSwatch } from "./OmbreSwatch";
import { RainbowSwatch } from "./RainbowSwatch";
import { ShapeButton } from "./ShapeButton";
import { Swatch } from "./Swatch";

export type TrayExtra = {
  id: string;
  label: string;
  active: boolean;
  component: ComponentType<AssetProps>;
  onToggle: () => void;
};

type TrayProps = {
  studio: StudioDefinition;
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  extras?: TrayExtra[];
};

export function Tray({ studio, tool, onToolChange, extras = [] }: TrayProps) {
  // Picking a shape or color leaves sticker mode; picking the same
  // sticker again toggles back out of it.
  const pickShape = (assetId: string) =>
    onToolChange({ ...tool, assetId, emoji: null });
  const pickColor = (tint: string) =>
    onToolChange({ ...tool, tint, emoji: null });
  const pickSticker = (emoji: string) =>
    onToolChange({ ...tool, emoji: tool.emoji === emoji ? null : emoji });

  const inColorMode = tool.emoji === null;
  const presetTints = new Set<string>();
  for (const item of studio.palette) {
    if (typeof item === "string") presetTints.add(item);
    else if ("ombre" in item) presetTints.add(ombreTint(...item.ombre));
  }

  return (
    <div className="tray">
      <div className="tray-row" role="group" aria-label="Bead shapes">
        {Object.values(studio.assets)
          .filter((asset) => !asset.fixed)
          .map((asset) => (
            <ShapeButton
              key={asset.id}
              asset={asset}
              tint={tool.tint}
              selected={inColorMode && tool.assetId === asset.id}
              onSelect={pickShape}
            />
          ))}
        {extras.map((extra) => (
          <ExtraButton
            key={extra.id}
            label={extra.label}
            active={extra.active}
            tint={tool.tint}
            component={extra.component}
            onToggle={extra.onToggle}
          />
        ))}
      </div>
      <div className="tray-row" role="group" aria-label="Colors">
        {studio.palette.map((item) => {
          if (typeof item === "string") {
            return (
              <Swatch
                key={item}
                color={item}
                selected={inColorMode && tool.tint === item}
                onSelect={pickColor}
              />
            );
          }
          if ("rainbow" in item) {
            return (
              <RainbowSwatch
                key="rainbow"
                colors={item.rainbow}
                currentTint={tool.tint}
                onSelect={pickColor}
              />
            );
          }
          if ("ombre" in item) {
            const [from, to] = item.ombre;
            return (
              <OmbreSwatch
                key={`ombre-${from}-${to}`}
                from={from}
                to={to}
                selected={inColorMode && tool.tint === ombreTint(from, to)}
                onSelect={pickColor}
              />
            );
          }
          return (
            <CustomColorSwatch
              key="custom"
              currentTint={tool.tint}
              selected={inColorMode && !presetTints.has(tool.tint)}
              onSelect={pickColor}
            />
          );
        })}
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
