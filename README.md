# ✨ Sparkle Studio

A free, no-ads collection of creative mini-studios for kids (ages 4–10). No brushes, no drawing — every interaction feels like placing stickers: **tap a color, tap a spot, done.**

Access [sparkle studio here](https://sparklestudio.vercel.app/).

## Why I built this?
It was summer. My daughter would come home early from camp every day, 
and somehow we ended up on a mission — a new nail salon app every day 
for a whole week. Download, get excited, do two designs, hit a wall. 
Ads every 30 seconds. "Subscribe to unlock" on every good color. 
She'd hand me the phone with this look like, can you fix it?

So I did. I built her one. No ads, no subscriptions, no paywalls. 
Just a bracelet maker to start, with more studios coming.

This is Sparkle Studio.

## WHAT I LEARNED (personal, honest)

The hand SVG problem:
The original plan was a nail art app. I spent two weeks trying to get 
a production-quality hand SVG. AI-generated PNGs looked great but 
converting them to clean interactive SVGs was a nightmare — auto-tracing 
created messy vectors, and hand-writing anatomically correct finger paths 
is genuinely hard. The nail studio is still coming, just waiting for a 
better illustration solution. That detour taught me to start with the 
simplest possible asset and prove the interaction first. Hence bracelets.

The modular insight:
Once the bracelet was working, it became obvious that the interaction 
engine had nothing to do with bracelets specifically. Slots, placements, 
a tray of tools, tap-to-fill — that's the whole app. Every future studio 
is just a different set of slots and a different set of assets plugged 
into the same engine. That realization shaped the entire architecture.

## Studios

- **📿 Bracelet Maker** — build a bracelet bead by bead
- **🧁 Cupcake Designer** — coming soon
- **🍦 Ice Cream Creator** — coming soon

## Features

### Creating
- **4 bead shapes** (circle, heart, star, flower) placed on 14 slots around the bracelet
- **Tap-to-fill**: pick a shape and color, tap a slot — the bead pops in with a springy animation; tap a filled bead to recolor or reshape it
- **Rich color tray**: 12 preset colors, a rainbow swatch that cycles colors on each tap, 3 ombre gradients, and a native color picker for any custom color
- **Emoji stickers** (⭐ 🌸 🦋 🌈 💎 🍭 🎀) that sit on top of circle beads — valid targets glow, everything else dims, no explanation needed
- **Glitter mode**: toggle ✨ and tap beads to add a twinkling shimmer over any color, ombre, or custom color
- **Tassel**: one tap adds a tassel hanging from the bottom of the bracelet in the current color; tap the button again to remove it

### Kid-proofing
- **Undo instead of confirmation dialogs** — even "Start over" is undoable
- **Backup restore**: if a design gets wiped (Start over + reload), a gentle prompt offers to bring back the last bracelet
- No text instructions anywhere; the UI communicates through glow, dim, and motion
- No double-tap zoom, no text selection, no accidental scrolling

### Keeping creations
- **Save to PNG** — a full-screen confetti celebration ("So pretty! ✨"), then the bracelet downloads as an image
- **Auto-persistence** — the current design saves to localStorage on every change and restores on reopen
- **Works offline** — installable PWA; after the first visit it runs with no connection at all (plane-friendly)

### Everywhere
- Fully responsive: phones get a compact two-row color grid, tablets and desktops a scrolling tray
- Touch targets sized for small hands (44–64px)

## Architecture

The whole app is one idea: **a studio is a scene made of slots, and a design is a list of what's in each slot.** The engine knows nothing about bracelets — it fills slots, undoes, saves, and exports. Each studio is just configuration plus small SVG asset components.

### Layers

Dependencies point downward only — `core` and `ui` never import from `studios`:

```mermaid
flowchart TD
    subgraph app["src/app — shell"]
        App["App.tsx<br/>screen switching"]
        Home["Home.tsx<br/>studio picker"]
        Screen["StudioScreen.tsx<br/>wires engine + UI per studio"]
        Registry["registry.ts<br/>studioId → StudioDefinition"]
    end

    subgraph studios["src/studios — content (config + assets)"]
        Bracelet["bracelet/config.tsx<br/>slots · palette · stickers · toggleables"]
        Assets["bracelet/assets/*.tsx<br/>CircleBead · HeartBead · StarBead · FlowerBead · Tassel"]
    end

    subgraph ui["src/ui — shared presentational components"]
        Shell["StudioShell · Stage · Tray"]
        Buttons["Swatch · OmbreSwatch · RainbowSwatch · CustomColorSwatch<br/>ShapeButton · EmojiButton · GlitterButton · ExtraButton"]
        Overlays["Celebration · RestorePrompt"]
    end

    subgraph core["src/core — studio-agnostic engine"]
        Types["types.ts<br/>Slot · Placement · Design · StudioDefinition"]
        Hook["useDesign.ts<br/>reducer: place / undo / reset / load"]
        Storage["storage.ts<br/>persistence + backup"]
        Export["export.ts<br/>SVG → PNG"]
        Palette["palette.ts<br/>ombre gradient ids"]
    end

    App --> Home
    App --> Screen
    Screen --> Registry
    Registry --> Bracelet
    Bracelet --> Assets
    Screen --> ui
    Screen --> core
    ui --> core
    studios --> core
```

### One tap, end to end

```mermaid
sequenceDiagram
    actor Kid
    participant Tray
    participant Screen as StudioScreen
    participant Engine as useDesign (reducer)
    participant Stage
    participant Storage as localStorage

    Kid->>Tray: tap 💗 heart + pink
    Tray->>Screen: tool = { assetId, tint }
    Kid->>Stage: tap a slot
    Stage->>Screen: onSlotTap(slotId)
    Screen->>Screen: mode rules (bead / sticker / glitter / tassel)
    Screen->>Engine: place({ slotId, assetId, tint })
    Engine->>Engine: snapshot old placements → undo stack
    Engine-->>Stage: new Design
    Stage-->>Kid: bead pops in 🎉
    Engine-->>Storage: debounced save (+ backup if non-empty)
```

### The data model

A creation is tiny and fully serializable — this is what makes undo, persistence, backup restore, and PNG export nearly free:

```mermaid
classDiagram
    class StudioDefinition {
        id · name · icon
        stage (size + background)
        slots: Slot[]
        assets: map of id → AssetDef
        palette: PaletteItem[]
        stickers: emoji[]
        toggleables (e.g. tassel)
    }
    class Slot {
        id · x · y
        rotation · scale
        accepts: category[]
    }
    class Design {
        studioId
        placements: Placement[]
    }
    class Placement {
        slotId
        assetId
        tint?
        emoji?
        glitter?
    }
    class AssetDef {
        category
        component (SVG, takes tint)
        tintable · stickerable · fixed
    }
    StudioDefinition "1" --> "*" Slot
    StudioDefinition "1" --> "*" AssetDef
    Design "1" --> "*" Placement
    Placement --> Slot : fills
    Placement --> AssetDef : renders
```

### Assets are components, not files

Every visual piece (bead, tassel — later frosting, scoops, …) is a small React component drawing SVG, centered on `(0,0)` in a ~100-unit box, taking a `tint` prop for its colorable regions:

```tsx
export const HeartBead: BeadAsset = ({ tint }) => (
  <g>
    <path d="M 0 42 C ..." fill={tint} stroke="rgba(0,0,0,0.18)" />
    <ellipse /* fixed white highlight */ />
  </g>
);
```

No SVG build pipeline, no design-tool dependency; tinting (including ombre gradients via `url(#...)` paint refs) is just a prop.

### Adding a new studio

The test every refactor is held to: **a new studio requires zero engine changes.**

1. Create `src/studios/<name>/config.tsx` — a `StudioDefinition` (slots, palette, assets, stickers)
2. Author the asset components in `src/studios/<name>/assets/`
3. Register it in `src/app/registry.ts` (one line)

The home screen card, tray, undo, save, persistence, backup restore, PWA caching, and PNG export all come along for free.

## Tech

React 19 · TypeScript · Vite · SVG · [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (offline support) · Claude Fable 5

No state library, no router, no CSS framework — one `useReducer` hook and plain CSS cover the current needs.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build (includes service worker)
npm run preview  # serve the production build (needed to test PWA/offline)
```

Deploys to production automatically from `main` via Vercel.

## License

[MIT](LICENSE)
