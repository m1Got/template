import fs from "node:fs";
import path from "node:path";
import Fontmin from "fontmin";
import { isEmptyDir, paths } from "./common.js";

const fontsFile = `${paths.src}/styles/fonts.css`;
const fontsSrcFolder = `${paths.src}/fonts/`;
const fontsDistFolder = `${paths.public}/fonts/`;

const fontStyle = ({ family, name, ext, weight }) => `@font-face {
	font-family: ${family};
	font-display: swap;
	src: url("../fonts/${name}.${ext}") format("${ext}");
	font-weight: ${weight};
	font-style: normal;
}\n\n`;

const fontWeights = {
  thin: "100",
  extralight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  heavy: "800",
  black: "900",
};

const fontmin = new Fontmin()
  .src(`${fontsSrcFolder}*.{ttf,otf}`)
  .dest(fontsDistFolder);

fontmin.run().on("end", async () => {
  await fontsStyle();
});

async function fontsStyle() {
  try {
    if (!fs.existsSync(fontsSrcFolder)) {
      console.warn("you don't have a folder with fonts!!");
      return;
    }

    if (fs.existsSync(fontsFile)) {
      fs.unlinkSync(fontsFile);
    }

    if (await isEmptyDir(fontsSrcFolder)) {
      console.log("there are no required files in the fonts folder!!");
      return;
    }

    let newFileOnly;
    const fontsFromSrc = fs.readdirSync(fontsSrcFolder);
    const fontsFromDist = fs.readdirSync(fontsDistFolder);

    const woff2Files = fontsFromDist.filter((font) => {
      const isWoff2 = path.extname(font) === ".woff2";
      if (!isWoff2) {
        fs.unlinkSync(path.normalize(`${fontsDistFolder}/${font}`));
      }

      return isWoff2;
    });

    woff2Files.forEach((font) => {
      const ext = path.extname(font).substring(1);
      const name = path.basename(font, path.extname(font));
      const weightName = name.split("-")[1] ?? "regular";
      const family = name.split("-")[0] ?? name;
      const weight = fontWeights[weightName.toLowerCase()] ?? "400";

      if (newFileOnly !== name) {
        fs.appendFileSync(fontsFile, fontStyle({ ext, family, name, weight }));
        newFileOnly = name;
      }
    });

    fontsFromSrc.forEach((font) => {
      const isWoff2 = path.extname(font) === ".woff2";

      if (isWoff2) {
        fs.copyFileSync(
          path.normalize(`${fontsSrcFolder}/${font}`),
          path.normalize(`${fontsDistFolder}/${font}`),
        );
      }
    });

    console.warn("Success!!", "don't forget check font-weight and font-style");
  } catch (err) {
    console.error(err);
  }
}
