import fs from "node:fs";
import svgtofont from "svgtofont";
import { paths, isEmptyDir } from "./common.js";

const iconsSrcFolder = `${paths.src}/icons`;
const iconsDistFolder = `${paths.public}/icons`;

/**
 * @type {import('svgtofont').SvgToFontOptions}
 */

const options = {
  src: iconsSrcFolder,
  dist: iconsDistFolder,

  fontName: "icons",
  classNamePrefix: "icon",

  css: {
    output: "src/styles",
    include: "\\.css",
    fileName: "icons",
    fontSize: "1rem",
    cssPath: "../icons/",
  },
  emptyDist: false,
  outSVGReact: false,
  outSVGReactNative: false,
  outSVGPath: false,
  generateInfoData: false,
  log: false,
};

const removingFolders = [`${iconsDistFolder}/styles`];
const removingFiles = [
  `${iconsDistFolder}/${options.fontName}.eot`,
  `${iconsDistFolder}/${options.fontName}.svg`,
  `${iconsDistFolder}/${options.fontName}.ttf`,
];

const iconsCSSFile = paths.src + `/styles/${options.css.fileName}.css`;

const beginOfCSSFile = `@font-face {
  font-family: "${options.fontName}";
  src: url("${options.css.cssPath}${options.fontName}.woff2") format("woff2"), url("${options.css.cssPath}${options.fontName}.woff") format("woff");
}

[class^="${options.classNamePrefix}-"],
[class*=" ${options.classNamePrefix}-"] {
  font-family: "${options.fontName}" !important;
  font-style: normal;
  font-size: ${options.css.fontSize};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

async function svgToFont() {
  try {
    if (!fs.existsSync(iconsSrcFolder) || (await isEmptyDir(iconsSrcFolder))) {
      console.log("icons folder is empty!!");
      return;
    }

    await svgtofont(options);

    removingFolders.forEach(
      (path) => fs.existsSync(path) && fs.rmdirSync(path),
    );
    removingFiles.forEach((path) => fs.existsSync(path) && fs.unlinkSync(path));

    fs.renameSync(
      `${iconsDistFolder}/icons.symbol.svg`,
      `${iconsDistFolder}/sprite.svg`,
    );

    if (!fs.existsSync(iconsCSSFile)) {
      console.log("icons.css file not found!!");
      return;
    }
    const iconsCSSContent = fs.readFileSync(iconsCSSFile, "utf8");
    const iconsCSSContentByRows = iconsCSSContent.toString().split("\n");
    const slicedContent = iconsCSSContentByRows.slice(18).join("\n");

    fs.writeFileSync(iconsCSSFile, beginOfCSSFile + "\n" + slicedContent);

    console.log("done!!");
  } catch (err) {
    console.error(err);
  }
}

await svgToFont();
