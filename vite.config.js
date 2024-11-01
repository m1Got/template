import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import injectHTML from "vite-plugin-html-inject";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  appType: "mpa",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    cssMinify: "esbuild",
    minify: false,
    modulePreload: { polyfill: false },
    terserOptions: { compress: false, mangle: false },
    rollupOptions: {
      input: { ...getPages(filesWithExt("src", ".html")) },
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

function filesWithExt(dir, ext) {
  try {
    const files = fs.readdirSync(dir);
    return files.filter((file) => path.extname(file) === ext);
  } catch (error) {
    console.log(error);
  }
}
