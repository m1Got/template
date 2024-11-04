import fs from "node:fs";
import path from "node:path";

export const paths = {
  src: path.resolve(process.cwd(), "src"),
  public: path.resolve(process.cwd(), "public"),
};

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

export function getPages(pages) {
  return pages.reduce((acc, page) => {
    acc[page] = new URL(`${paths.src}/${page}`, import.meta.url).pathname;
    return acc;
  }, {});
}
