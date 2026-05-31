/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/MyDigiPro/",
  plugins: [react()],

  test: {
    globals: true,
    environment: "jsdom",

    setupFiles: "./src/setupTests.ts",

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],

      exclude: [
        "node_modules/",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "dist/",
        "*.config.*",
        "coverage/"
      ]
    }
  }
});