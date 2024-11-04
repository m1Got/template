import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import injectHTML from "vite-plugin-html-inject";

import { filesWithExt, getPages, paths } from "./config/common";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  appType: "mpa",
  server: { host: true, watch: { usePolling: true } },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    cssMinify: "esbuild",
    minify: false,
    modulePreload: { polyfill: false },
    terserOptions: { compress: false, mangle: false },
    rollupOptions: {
      input: {
        ...getPages(filesWithExt(paths.src, ".html")),
      },
      output: {
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  plugins: [
    ViteImageOptimizer({
      includePublic: true,
      test: /\.(jpe?g|png|gif|tiff|webp|avif)$/i,
    }),
    injectHTML({ tagName: "include" }),
  ],
});
