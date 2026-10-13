import { bundle } from "@remotion/bundler";
import {
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
import { installFilms } from "./install.mjs";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve, join } from "node:path";

const require = createRequire(import.meta.url);
const requested = process.argv[2];
if (requested && !["light", "dark"].includes(requested))
  throw new Error("Use light or dark, or omit to render both.");
// Remotion already ships FFmpeg. Its shared libraries need an explicit path on macOS.
const linuxSuffix =
  process.platform === "linux"
    ? process.report.getReport().header.glibcVersionRuntime
      ? "-gnu"
      : "-musl"
    : "";
const packageName = `@remotion/compositor-${process.platform}-${process.arch}${process.platform === "win32" ? "-msvc" : linuxSuffix}`;
const binaries = dirname(require.resolve(`${packageName}/package.json`));
const ffmpeg =
  process.env.FFMPEG ||
  join(binaries, process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
const env = {
  ...process.env,
  DYLD_LIBRARY_PATH: binaries,
  LD_LIBRARY_PATH: binaries,
};
const run = (args) =>
  new Promise((resolveRun, reject) => {
    const child = spawn(ffmpeg, args, { env, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolveRun() : reject(new Error(`FFmpeg exited ${code}`)),
    );
  });
const browserOptions = process.env.REMOTION_BROWSER
  ? { browserExecutable: process.env.REMOTION_BROWSER }
  : {};
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
for (const theme of requested ? [requested] : ["light", "dark"]) {
  const dir = `out/${theme}`;
  await mkdir(dir, { recursive: true });
  const composition = await selectComposition({
    ...browserOptions,
    serveUrl,
    id: `HeroAd-${theme}`,
  });
  let last = -1;
  await renderMedia({
    ...browserOptions,
    serveUrl,
    composition,
    outputLocation: `${dir}/master.mp4`,
    codec: "h264",
    crf: 14,
    concurrency: 4,
    onProgress: ({ progress }) => {
      const step = Math.floor(progress * 10);
      if (step > last) {
        last = step;
        console.log(`${theme}: rendering ${step * 10}%`);
      }
    },
  });
  await renderStill({
    ...browserOptions,
    serveUrl,
    composition,
    frame: 0,
    output: `${dir}/poster.png`,
  });
  console.log(`${theme}: encoding browser delivery files`);
  const input = [
    "-v",
    "error",
    "-y",
    "-i",
    `${dir}/master.mp4`,
    "-an",
    "-vf",
    "scale=1280:720",
    "-pix_fmt",
    "yuv420p",
  ];
  await run([
    ...input,
    "-c:v",
    "libx264",
    "-crf",
    "21",
    "-preset",
    "slow",
    "-movflags",
    "+faststart",
    `${dir}/ads.mp4`,
  ]);
  await run([
    ...input,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    "0",
    "-crf",
    "33",
    "-row-mt",
    "1",
    "-cpu-used",
    "3",
    `${dir}/ads.webm`,
  ]);
}

await installFilms(requested ? [requested] : ["light", "dark"]);
