import path from "node:path";
import { defineConfig } from "vite";

// Production server bundle. Dependencies listed in package.json are kept
// external (Vite's SSR default) and resolved from node_modules at runtime.
export default defineConfig({
  build: {
    ssr: path.resolve(__dirname, "server/node-build.ts"),
    outDir: "dist/server",
    target: "node22",
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: "[name].mjs",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
