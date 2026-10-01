import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/homepage/",
  plugins: [
    {
      name: "omit-unpublished-posts",
      enforce: "pre",
      load(id) {
        if (!/\/src\/content\/posts\/[^/]+\.json$/.test(id)) return null;
        const content = readFileSync(id, "utf8");
        return JSON.parse(content).status === "published" ? content : "{}";
      },
    },
    react(),
  ],
  test: {
    include: ["src/**/*.test.{js,jsx}"],
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
  },
});
