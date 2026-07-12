import { RAINBOW_TINT } from "../../core/palette";
import type { StudioDefinition } from "../../core/types";
import { CakeBody } from "./assets/CakeBody";
import { Candle } from "./assets/Candle";
import { Cherry } from "./assets/Cherry";
import { emojiTopper } from "./assets/EmojiTopper";
import { Frosting } from "./assets/Frosting";
import { Sprinkles } from "./assets/Sprinkles";
import { StarTopper } from "./assets/StarTopper";
import { Wrapper } from "./assets/Wrapper";

const STAGE_W = 640;
const STAGE_H = 640;
const CX = STAGE_W / 2;

/** A flavor recolors frosting and cake together as a matched pair. */
export type Flavor = {
  id: string;
  name: string;
  emoji: string;
  frosting: string;
  cake: string;
};

export const FLAVORS: Flavor[] = [
  { id: "strawberry", name: "Strawberry", emoji: "🍓", frosting: "#FF9EC9", cake: "#FFDCEA" },
  { id: "chocolate", name: "Chocolate", emoji: "🍫", frosting: "#5C3A21", cake: "#9C6B3F" },
  { id: "lemon", name: "Lemon", emoji: "🍋", frosting: "#FFE066", cake: "#FFF6C9" },
  { id: "blueberry", name: "Blueberry", emoji: "🫐", frosting: "#9B7EDE", cake: "#E4DAF9" },
  { id: "matcha", name: "Matcha", emoji: "🍵", frosting: "#A9C7A0", cake: "#DCEDD4" },
  { id: "vanilla", name: "Vanilla", emoji: "🍪", frosting: "#FFF1D6", cake: "#E3A857" },
  { id: "peach", name: "Peach", emoji: "🍑", frosting: "#FFBC94", cake: "#FFE3CE" },
  { id: "rainbow", name: "Rainbow", emoji: "🌈", frosting: RAINBOW_TINT, cake: "#FFFFFF" },
];

export const TOPPINGS = [
  { id: "cherry", name: "Cherry", emoji: "🍒", tint: "#E5484D" },
  { id: "candle", name: "Candle", emoji: "🕯️", tint: "#FF6FB5" },
  { id: "star", name: "Star", emoji: "⭐", tint: "#FFD700" },
  { id: "top-strawberry", name: "Strawberry", emoji: "🍓", tint: "#E5484D" },
  { id: "top-flower", name: "Flower", emoji: "🌸", tint: "#FF9EC9" },
  { id: "top-butterfly", name: "Butterfly", emoji: "🦋", tint: "#4D96FF" },
  { id: "top-crown", name: "Crown", emoji: "👑", tint: "#FFD700" },
  { id: "top-heart", name: "Heart", emoji: "❤️", tint: "#FF5A5F" },
  { id: "top-bow", name: "Bow", emoji: "🎀", tint: "#FF6FB5" },
  { id: "top-rainbow", name: "Rainbow", emoji: "🌈", tint: "#B983FF" },
  { id: "top-gummy", name: "Gummy", emoji: "🐻", tint: "#FFA33E" },
] as const;

/** Wrapper and sprinkle color choices — same solids as the bracelet. */
export const CUPCAKE_COLORS = [
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

const plate = (
  <>
    <defs>
      <filter id="cupcake-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
    <ellipse
      cx={CX}
      cy={552}
      rx={200}
      ry={28}
      fill="white"
      opacity={0.75}
      stroke="rgba(92,68,87,0.1)"
      strokeWidth={2}
    />
    {/* Soft shadow lifting the cupcake off the plate. */}
    <ellipse
      cx={CX}
      cy={546}
      rx={150}
      ry={17}
      fill="rgba(92,68,87,0.28)"
      filter="url(#cupcake-shadow)"
    />
  </>
);

export const cupcakeStudio: StudioDefinition = {
  id: "cupcake",
  name: "Cupcake Designer",
  icon: "🧁",
  creationName: "cupcake",
  stage: { width: STAGE_W, height: STAGE_H, background: plate },
  // Array order is z-order: the cake sits behind the wrapper so the
  // wrapper's ruffled front edge overlaps it, like a real paper case.
  slots: [
    { id: "cake", x: CX, y: 375, accepts: ["cake"], required: true, hideGhost: true },
    { id: "wrapper", x: CX, y: 465, accepts: ["wrapper"], required: true, hideGhost: true },
    { id: "frosting", x: CX, y: 270, accepts: ["frosting"], required: true, hideGhost: true },
    { id: "sprinkles", x: CX, y: 270, accepts: ["sprinkles"], hideGhost: true },
    { id: "topping", x: CX, y: 150, accepts: ["topping"], hideGhost: true },
  ],
  assets: {
    wrapper: { id: "wrapper", category: "wrapper", component: Wrapper, tintable: true },
    cake: { id: "cake", category: "cake", component: CakeBody, tintable: true },
    frosting: { id: "frosting", category: "frosting", component: Frosting, tintable: true },
    sprinkles: { id: "sprinkles", category: "sprinkles", component: Sprinkles, tintable: true },
    cherry: { id: "cherry", category: "topping", component: Cherry, tintable: false },
    candle: { id: "candle", category: "topping", component: Candle, tintable: true },
    star: { id: "star", category: "topping", component: StarTopper, tintable: true },
    "top-strawberry": { id: "top-strawberry", category: "topping", component: emojiTopper("🍓"), tintable: false },
    "top-flower": { id: "top-flower", category: "topping", component: emojiTopper("🌸"), tintable: false },
    "top-butterfly": { id: "top-butterfly", category: "topping", component: emojiTopper("🦋"), tintable: false },
    "top-crown": { id: "top-crown", category: "topping", component: emojiTopper("👑"), tintable: false },
    "top-heart": { id: "top-heart", category: "topping", component: emojiTopper("❤️"), tintable: false },
    "top-bow": { id: "top-bow", category: "topping", component: emojiTopper("🎀"), tintable: false },
    "top-rainbow": { id: "top-rainbow", category: "topping", component: emojiTopper("🌈"), tintable: false },
    "top-gummy": { id: "top-gummy", category: "topping", component: emojiTopper("🐻"), tintable: false },
  },
  // Drives the Stage's gradient defs (rainbow frosting) and doubles as the
  // wrapper/sprinkle color choices in the cupcake's own tray.
  palette: [
    ...CUPCAKE_COLORS,
    { rainbow: ["#FF6FB5", "#FF5A5F", "#FFA33E", "#FFD93D", "#6BCB77", "#4D96FF", "#B983FF"] },
  ],
  stickers: [],
  // A fresh cupcake is a plain vanilla one in a pink case — every tab
  // then changes something visible. "Start over" returns here.
  initialPlacements: [
    { slotId: "wrapper", assetId: "wrapper", tint: "#FF6FB5" },
    { slotId: "cake", assetId: "cake", tint: "#E3A857" },
    { slotId: "frosting", assetId: "frosting", tint: "#FFF1D6" },
  ],
};
