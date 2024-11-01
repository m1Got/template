import fs from "node:fs";
import path from "node:path";

export const paths = {
  src: path.resolve(process.cwd(), "src"),
  public: path.resolve(process.cwd(), "public"),
  dist: path.resolve(process.cwd(), "dist"),
};

export function getPages(pages) {
  return pages.reduce((acc, page) => {
    acc[page] = new URL(`${paths.src}/${page}`, import.meta.url).pathname;
    return acc;
  }, {});
}

export function filesWithExt(dir, ext) {
  try {
    const files = fs.readdirSync(dir);
    return files.filter((file) => path.extname(file) === ext);
  } catch (error) {
    console.log(error);
  }
}

const cleanupEmptyFolders = async (folder) => {
  if (!fs.statSync(folder).isDirectory()) return;
  let files = fs.readdirSync(folder);

  if (files.length > 0) {
    files.forEach((file) => cleanupEmptyFolders(path.join(folder, file)));
    files = fs.readdirSync(folder);
  }

  if (files.length == 0) {
    fs.rmdirSync(folder);
  }
};

if (process.argv.includes("cleanup")) {
  cleanupEmptyFolders(paths.dist);
}
