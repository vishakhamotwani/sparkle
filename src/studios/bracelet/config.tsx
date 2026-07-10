import type { Slot, StudioDefinition } from "../../core/types";
import { CircleBead } from "./assets/CircleBead";
import { HeartBead } from "./assets/HeartBead";
import { StarBead } from "./assets/StarBead";
import { FlowerBead } from "./assets/FlowerBead";
import { Tassel } from "./assets/Tassel";

const STAGE_SIZE = 640;
const CENTER = STAGE_SIZE / 2;
const STRING_RADIUS = 235;
const BEAD_COUNT = 14;

function braceletSlots(): Slot[] {
  // Tassels come first so beads paint (and win taps) over their knots.
  const tassels = [78, 102].map((angle, i) => {
    const radians = (angle * Math.PI) / 180;
    return {
      id: `tassel-${i}`,
      // Slot origin sits below the string; the knot (drawn at y=-45)
      // lands exactly on it, and the strands hang straight down.
      x: CENTER + STRING_RADIUS * Math.cos(radians),
      y: CENTER + STRING_RADIUS * Math.sin(radians) + 45,
      accepts: ["tassel"],
    };
  });
  const beads = Array.from({ length: BEAD_COUNT }, (_, i) => {
    const angle = -90 + (i * 360) / BEAD_COUNT;
    const radians = (angle * Math.PI) / 180;
    return {
      id: `bead-${i}`,
      x: CENTER + STRING_RADIUS * Math.cos(radians),
      y: CENTER + STRING_RADIUS * Math.sin(radians),
      // Point each bead's "up" away from the bracelet's center.
      rotation: angle + 90,
      accepts: ["bead"],
    };
  });
  return [...tassels, ...beads];
}

const braceletString = (
  <circle
    cx={CENTER}
    cy={CENTER}
    r={STRING_RADIUS}
    fill="none"
    stroke="#D8C3A5"
    strokeWidth={7}
    strokeLinecap="round"
  />
);

export const braceletStudio: StudioDefinition = {
  id: "bracelet",
  name: "Bracelet Maker",
  icon: "📿",
  stage: {
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    background: braceletString,
  },
  slots: braceletSlots(),
  assets: {
    "bead-circle": {
      id: "bead-circle",
      category: "bead",
      component: CircleBead,
      tintable: true,
      stickerable: true,
    },
    "bead-heart": {
      id: "bead-heart",
      category: "bead",
      component: HeartBead,
      tintable: true,
    },
    "bead-star": {
      id: "bead-star",
      category: "bead",
      component: StarBead,
      tintable: true,
    },
    "bead-flower": {
      id: "bead-flower",
      category: "bead",
      component: FlowerBead,
      tintable: true,
    },
    tassel: {
      id: "tassel",
      category: "tassel",
      component: Tassel,
      tintable: true,
      fixed: true,
    },
  },
  initialPlacements: [
    { slotId: "tassel-0", assetId: "tassel", tint: "#FFD700" },
    { slotId: "tassel-1", assetId: "tassel", tint: "#FFD700" },
  ],
  palette: [
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
    {
      rainbow: [
        "#FF6FB5", // pink
        "#FF5A5F", // red
        "#FFA33E", // orange
        "#FFD93D", // yellow
        "#6BCB77", // green
        "#4D96FF", // blue
        "#B983FF", // purple
      ],
    },
    { ombre: ["#FF6FB5", "#B983FF"] }, // pink → purple
    { ombre: ["#4D96FF", "#6BCB77"] }, // blue → green
    { ombre: ["#FFD93D", "#FFA33E"] }, // yellow → orange
    { custom: true },
  ],
  stickers: ["✨", "⭐", "🌸", "🦋", "🌈", "💎", "🍭", "🎀"],
};
