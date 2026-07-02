import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] }), tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@mediapipe/pose": path.resolve(__dirname, "src/empty-mediapipe.ts"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    // All /api calls go to the Node.js backend during development.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
