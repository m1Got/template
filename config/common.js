import fs from "node:fs";
import path from "node:path";

export const paths = {
  src: path.resolve(process.cwd(), "src"),
  public: path.resolve(process.cwd(), "public"),
  dist: path.resolve(process.cwd(), "dist"),
  resources: path.resolve(process.cwd(), "resources"),
};

const willBeRemoved = [`${paths.dist}/layouts/base.htm`];

export function filesWithExt(dir, ext) {
  try {
    const files = fs.readdirSync(dir);
    return files.filter((file) => path.extname(file) === ext);
  } catch (error) {
    console.log(error);
  }
}

export async function isEmptyDir(path) {
  try {
    const directory = fs.opendirSync(path);

    const entry = await directory.read();
    await directory.close();

    return entry === null;
  } catch (error) {
    return false;
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

const removeFiles = async (files = []) => {
  try {
    files.forEach((file) => {
      const isExists = fs.existsSync(file);
      if (isExists) {
        fs.unlinkSync(file);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export function getPages(pages) {
  return pages.reduce((acc, page) => {
    acc[page] = new URL(`${paths.src}/${page}`, import.meta.url).pathname;
    return acc;
  }, {});
}

if (process.argv.includes("cleanup")) {
  removeFiles(willBeRemoved);
  cleanupEmptyFolders(paths.dist);
}
