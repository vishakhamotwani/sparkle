import type { PaletteItem, Slot, StudioDefinition } from "../../core/types";
import { almondShape } from "./assets/AlmondNail";
import { coffinShape } from "./assets/CoffinNail";
import { ovalShape } from "./assets/OvalNail";
import { roundShape } from "./assets/RoundNail";
import { shortShape } from "./assets/ShortNail";
import { squareShape } from "./assets/SquareNail";
import { stilettoShape } from "./assets/StilettoNail";
import { NailBase } from "./assets/NailBase";
import type { NailShape, PatternId } from "./assets/types";

const STAGE_W = 640;
const STAGE_H = 640;

export const NAIL_SHAPES: NailShape[] = [
  ovalShape,
  roundShape,
  almondShape,
  coffinShape,
  stilettoShape,
  squareShape,
  shortShape,
];

export const shapeById = (id: string): NailShape =>
  NAIL_SHAPES.find((s) => s.id === id) ?? ovalShape;

export const PATTERNS: { id: PatternId; name: string }[] = [
  { id: "french", name: "French tip" },
  { id: "stripes", name: "Stripes" },
  { id: "dots", name: "Dots" },
  { id: "marble", name: "Marble" },
  { id: "checker", name: "Checks" },
];

export const GEM_SHAPES = ["circle", "teardrop", "star", "heart"] as const;
export const GEM_SIZES = ["sm", "md", "lg"] as const;
export const GEM_ANCHORS = 5;

export const gemAssetId = (shape: string, size: string) =>
  `gem-${shape}-${size}`;

/** Soft neutral base so the fan is always visible. */
export const NEUTRAL_TINT = "#F0D3CB";

export const NAIL_SOLIDS = [
  "#FF6FB5", // pink
  "#FF5A5F", // red
  "#FFA33E", // orange
  "#FFD93D", // yellow
  "#6BCB77", // green
  "#4DD4E8", // aqua
  "#4D96FF", // blue
  "#B983FF", // purple
  "#FFFFFF", // white
  "#333333", // black
  "#FFD700", // gold
  "#C0C0C0", // silver
];

export const NAIL_PALETTE: PaletteItem[] = [
  { ombre: ["#FF6FB5", "#B983FF"] }, // pink → purple
  { ombre: ["#4D96FF", "#6BCB77"] }, // blue → green
  { ombre: ["#FFD93D", "#FFA33E"] }, // yellow → orange
  { ombre: ["#FF6FB5", "#FFD700"] }, // rose gold
  { ombre: ["#1E3A8A", "#7C3AED"] }, // midnight
  {
    rainbow: [
      "#FF6FB5",
      "#FF5A5F",
      "#FFA33E",
      "#FFD93D",
      "#6BCB77",
      "#4D96FF",
      "#B983FF",
    ],
  },
  ...NAIL_SOLIDS,
  { custom: true },
];

// Fan geometry: five fingertips spreading from a point below the stage.
const FAN_CENTER_X = STAGE_W / 2;
const FAN_CENTER_Y = 650;
const FAN_RADIUS = 330;
const FAN_ANGLES = [-36, -18, 0, 18, 36];
const FAN_SCALES = [0.86, 0.95, 1, 0.95, 0.86];

export function nailTransform(n: number) {
  const rad = (FAN_ANGLES[n] * Math.PI) / 180;
  return {
    x: FAN_CENTER_X + FAN_RADIUS * Math.sin(rad),
    y: FAN_CENTER_Y - FAN_RADIUS * Math.cos(rad),
    rotation: FAN_ANGLES[n],
    scale: FAN_SCALES[n],
  };
}

function nailSlots(): Slot[] {
  const slots: Slot[] = [];
  for (let n = 0; n < 5; n++) {
    const { x, y, rotation, scale } = nailTransform(n);
    slots.push({
      id: `nail-${n}`,
      x,
      y,
      rotation,
      scale,
      accepts: ["nail"],
      required: true,
      hideGhost: true,
    });
    slots.push({
      id: `pattern-${n}`,
      x,
      y,
      accepts: ["pattern"],
      hideGhost: true,
    });
    for (let a = 0; a < GEM_ANCHORS; a++) {
      slots.push({
        id: `gem-${n}-${a}`,
        x,
        y,
        accepts: ["gem"],
        hideGhost: true,
      });
    }
  }
  return slots;
}

/** Tray preview component for a pattern asset. */
const patternPreview = () => () => null;

export const nailStudio: StudioDefinition = {
  id: "nails",
  name: "Nail Studio",
  icon: "💅",
  creationName: "nail design",
  stage: { width: STAGE_W, height: STAGE_H },
  slots: nailSlots(),
  assets: {
    // Nail shapes (rendered by the studio's own stage).
    ...Object.fromEntries(
      NAIL_SHAPES.map((s) => [
        s.id,
        {
          id: s.id,
          category: "nail",
          component: () => <NailBase shape={s} tint={NEUTRAL_TINT} />,
          tintable: true,
        },
      ]),
    ),
    // Pattern overlays.
    ...Object.fromEntries(
      PATTERNS.map((p) => [
        `pattern-${p.id}`,
        {
          id: `pattern-${p.id}`,
          category: "pattern",
          component: patternPreview(),
          tintable: false,
        },
      ]),
    ),
    // Gems: shape × size.
    ...Object.fromEntries(
      GEM_SHAPES.flatMap((shape) =>
        GEM_SIZES.map((size) => [
          gemAssetId(shape, size),
          {
            id: gemAssetId(shape, size),
            category: "gem",
            component: patternPreview(),
            tintable: true,
          },
        ]),
      ),
    ),
  },
  palette: NAIL_PALETTE,
  stickers: [],
  initialPlacements: Array.from({ length: 5 }, (_, n) => ({
    slotId: `nail-${n}`,
    assetId: "nail-oval",
    tint: NEUTRAL_TINT,
  })),
};
