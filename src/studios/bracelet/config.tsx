import type { Slot, StudioDefinition } from "../../core/types";
import { CircleBead } from "./assets/CircleBead";
import { HeartBead } from "./assets/HeartBead";
import { StarBead } from "./assets/StarBead";
import { FlowerBead } from "./assets/FlowerBead";

const STAGE_SIZE = 640;
const CENTER = STAGE_SIZE / 2;
const STRING_RADIUS = 235;
const BEAD_COUNT = 14;

function braceletSlots(): Slot[] {
  return Array.from({ length: BEAD_COUNT }, (_, i) => {
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
  },
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
  ],
  stickers: ["✨", "⭐", "🌸", "🦋", "🌈", "💎", "🍭", "🎀"],
};
