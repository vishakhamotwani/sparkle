# Sparkle Studio

A free, no-ads collection of creative mini-studios for kids (ages 4–10). No brushes, no drawing — every interaction feels like placing stickers: tap a color, tap a spot, done.

## Studios

- **Bracelet Maker** — build a bracelet bead by bead: 4 shapes × 8 colors
- More coming: Cupcake Designer, Ice Cream Creator, and friends

## Features

- Tap-tap interactions designed for small hands — forgiving, satisfying, calm
- Undo instead of confirmation dialogs (even "Start over" is undoable)
- Fully responsive — phones, tablets, desktops
- Works offline as a PWA (installable, plane-friendly)

## Tech

React · TypeScript · SVG · Vite

Studios plug into a shared engine: a studio is just a config (slots + palette) plus a folder of small SVG asset components. See `src/core` for the engine, `src/studios/bracelet` for the reference studio.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build (includes service worker)
npm run preview  # serve the production build
```

## License

[MIT](LICENSE)
