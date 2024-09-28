import { defineConfig, normalizePath } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { preact } from "@preact/preset-vite";

import { filesWithExt, paths, getPages } from "./config/common.js";

/**
 * @type {import('vite-plugin-static-copy').Target}
 */
export default defineConfig({
  root: "src",
  publicDir: "../public",
  appType: "mpa",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    cssMinify: false,
    rollupOptions: {
      input: { ...getPages(filesWithExt(paths.src, ".html")) },
    },
  },
  plugins: [
    preact({}),
    ViteImageOptimizer({ includePublic: true }),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(`${paths.src}/layouts/*.htm`),
          dest: normalizePath(`${paths.dist}/layouts/`),
        },
      ],
    }),
  ],
});
