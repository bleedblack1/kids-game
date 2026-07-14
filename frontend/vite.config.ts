import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Kalqy — Move · Play · Learn",
        short_name: "Kalqy",
        description: "Camera-controlled learning games for kids 3–6.",
        theme_color: "#7c3aed",
        background_color: "#0b1020",
        display: "standalone",
        orientation: "landscape",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Cache the app shell + model assets so games launch offline.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        runtimeCaching: [
          {
            // Vocabulary content is safe to serve stale-while-revalidate.
            urlPattern: ({ url }) => url.pathname.startsWith("/api/v1/words"),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "kalqy-words" },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@mediapipe/pose": path.resolve(__dirname, "src/empty-mediapipe.ts"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    // All /api calls go to the NestJS backend during development.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
