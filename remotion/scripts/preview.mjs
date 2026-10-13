import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
const browserOptions = process.env.REMOTION_BROWSER
  ? { browserExecutable: process.env.REMOTION_BROWSER }
  : {};
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
await mkdir("out/review", { recursive: true });
for (const theme of ["light", "dark"]) {
  const composition = await selectComposition({
    ...browserOptions,
    serveUrl,
    id: `HeroAd-${theme}`,
  });
  for (const frame of [
    0, 70, 180, 275, 310, 350, 425, 470, 500, 625, 740, 835, 899,
  ]) {
    await renderStill({
      ...browserOptions,
      serveUrl,
      composition,
      frame,
      output: `out/review/${theme}-${frame}.png`,
      scale: 0.5,
    });
    console.log(`${theme}: frame ${frame}`);
  }
}
