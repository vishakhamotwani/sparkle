import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Precache the entire build so the app fully works offline.
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      },
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "hand.svg"],
      manifest: {
        name: "Sparkle Studio",
        short_name: "Sparkle",
        description: "Creative studios for kids — make bracelets and more",
        theme_color: "#ffe3ef",
        background_color: "#fff5fa",
        display: "standalone",
        orientation: "any",
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
