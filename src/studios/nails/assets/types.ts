import type { ComponentType } from "react";

/** One placed gem, resolved for rendering. */
export type PlacedGem = {
  /** Anchor index 0-4 on the nail. */
  anchor: number;
  shape: "circle" | "teardrop" | "star" | "heart";
  size: "sm" | "md" | "lg";
  tint: string;
};

export type PatternId = "stripes" | "dots" | "marble" | "checker" | "french";

/** Geometry for one nail silhouette, centered on (0,0), width ~72. */
export type NailShape = {
  id: string;
  name: string;
  path: string;
  height: number;
};

export type NailProps = {
  tint: string;
  pattern?: PatternId;
  glitter?: boolean;
  gems?: PlacedGem[];
  selected?: boolean;
  /** Tap on a placed gem (to remove it). */
  onGemTap?: (anchor: number) => void;
};

export type NailComponent = ComponentType<NailProps>;
