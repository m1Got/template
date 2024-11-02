import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import injectHTML from "vite-plugin-html-inject";

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
        ...getPages(
          fs
            .readdirSync("src")
            .filter((file) => path.extname(file) === ".html"),
        ),
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

function getPages(pages) {
  return pages.reduce((acc, page) => {
    acc[page] = new URL(`src/${page}`, import.meta.url).pathname;
    return acc;
  }, {});
}
