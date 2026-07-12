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
  // The tassel comes first so its knot paints behind the bottom bead,
  // reading as "hangs from beneath it"; the strands clear the bead below.
  const tassel: Slot = {
    id: "tassel",
    x: CENTER,
    y: CENTER + STRING_RADIUS,
    accepts: ["tassel"],
    hideGhost: true,
  };
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
  return [tassel, ...beads];
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
  creationName: "bracelet",
  stage: {
    width: STAGE_SIZE,
    // Extra room below the bracelet for the tassel strands.
    height: STAGE_SIZE + 60,
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
  toggleables: [{ slotId: "tassel", assetId: "tassel", label: "tassel" }],
  // Ombres lead — user testing showed kids reach for them first.
  palette: [
    { ombre: ["#FF6FB5", "#B983FF"] }, // pink → purple
    { ombre: ["#4D96FF", "#6BCB77"] }, // blue → green
    { ombre: ["#FFD93D", "#FFA33E"] }, // yellow → orange
    { ombre: ["#FFA33E", "#FF6FB5"] }, // sunset: orange → pink
    { ombre: ["#2DD4BF", "#4D96FF"] }, // ocean: teal → blue
    { ombre: ["#FF6FB5", "#FF5A5F"] }, // candy: pink → red
    { ombre: ["#6BCB77", "#2E7D32"] }, // forest: green → dark green
    { ombre: ["#FFC7E3", "#D8B4FE"] }, // cotton candy: light pink → light purple
    { ombre: ["#FFCBA4", "#FF6F61"] }, // peach: peach → coral
    { ombre: ["#1E3A8A", "#7C3AED"] }, // midnight: dark blue → purple
    { ombre: ["#FF6FB5", "#FFD700"] }, // rose gold: pink → gold
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
    { custom: true },
  ],
  stickers: [
    "⭐", "🌸", "🦋", "🌈", "💎", "🍭", "🎀",
    "🦄", "🌺", "🍓", "🎵", "💫", "🌙", "🍦", "👑", "🐝", "🌻", "🎈", "🍄",
  ],
  glitter: true,
  // Phones show 10 essential colors; aqua and silver are the nearest
  // duplicates of blue and white/gray, so they sit out.
  compactHide: ["#4DD4E8", "#C0C0C0"],
};
