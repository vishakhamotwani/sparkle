import type { ComponentType, ReactNode } from "react";

/** Props every placeable asset component receives. */
export type AssetProps = {
  /** Fill color for the asset's tintable regions. */
  tint: string;
};

export type AssetDef = {
  id: string;
  /** Which slot categories this asset can go into, e.g. "bead". */
  category: string;
  component: ComponentType<AssetProps>;
  tintable: boolean;
};

export type Slot = {
  id: string;
  /** Position in stage coordinates. Assets are authored centered on (0,0). */
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  /** Asset categories this slot accepts. */
  accepts: string[];
  required?: boolean;
};

export type Placement = {
  slotId: string;
  assetId: string;
  tint?: string;
  /** Emoji sticker rendered on top of the asset. */
  emoji?: string;
};

/** A complete creation — serializable, tiny, and the unit of undo/save/share. */
export type Design = {
  studioId: string;
  placements: Placement[];
};

/** The currently selected tray tool: what gets placed on the next slot tap. */
export type Tool = {
  assetId: string;
  tint: string;
  /** When set, the tool is in sticker mode: taps add this emoji on top. */
  emoji: string | null;
};

/** A plain color, or a rainbow swatch that cycles through colors per tap. */
export type PaletteItem = string | { rainbow: string[] };

export type StudioDefinition = {
  id: string;
  name: string;
  /** Emoji shown on the studio's home-screen card. */
  icon: string;
  stage: {
    width: number;
    height: number;
    /** Static scenery rendered beneath all slots (e.g. the bracelet string). */
    background?: ReactNode;
  };
  slots: Slot[];
  assets: Record<string, AssetDef>;
  palette: PaletteItem[];
  /** Emoji stickers available in the tray. */
  stickers: string[];
};
