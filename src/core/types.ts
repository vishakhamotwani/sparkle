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
  /**
   * Part of the scene (e.g. tassels) rather than a tray choice: not offered
   * as a shape, and taps on it only recolor it.
   */
  fixed?: boolean;
  /** Whether emoji stickers can sit on this asset (e.g. only circle beads). */
  stickerable?: boolean;
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
  /** Don't render the empty-slot ghost (for toggleable decoration slots). */
  hideGhost?: boolean;
};

export type Placement = {
  slotId: string;
  assetId: string;
  tint?: string;
  /** Emoji sticker rendered on top of the asset. */
  emoji?: string;
  /** Twinkling glitter overlay on top of the asset's color. */
  glitter?: boolean;
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
  /** Glitter mode: taps toggle a shimmer overlay on beads. */
  glitter: boolean;
};

/**
 * A tray color control: a plain color, a rainbow swatch that cycles through
 * colors per tap, a two-color ombre preset, or the free color picker.
 */
export type PaletteItem =
  | string
  | { rainbow: string[] }
  | { ombre: [string, string] }
  | { custom: true };

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
  /** Offer the glitter mode toggle in the tray. */
  glitter?: boolean;
  /**
   * Placements present in a fresh design. "Start over" returns to these
   * rather than to an empty stage.
   */
  initialPlacements?: Placement[];
  /**
   * On/off decorations (e.g. the bracelet tassel): a tray button adds the
   * asset to its dedicated slot in the current color, and removes it again.
   */
  toggleables?: { slotId: string; assetId: string; label: string }[];
};
