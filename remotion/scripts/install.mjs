import { createHash } from "node:crypto";
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Install immutable filenames only after every cut is encoded. Publishing the
// Encode a still to webp with the ffmpeg Remotion already ships, so the
// pipeline needs no extra image dependency.
async function encodeWebp(from, to) {
  const { createRequire } = await import("node:module");
  const { dirname, join } = await import("node:path");
  const { spawn } = await import("node:child_process");
  const require = createRequire(import.meta.url);
  const pkg = `@remotion/compositor-${process.platform}-${process.arch}${process.platform === "win32" ? "-msvc" : ""}`;
  const binaries = dirname(require.resolve(`${pkg}/package.json`));
  const ffmpeg = join(binaries, process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
  await new Promise((resolve, reject) => {
    const child = spawn(
      ffmpeg,
      ["-v", "error", "-y", "-i", from, "-quality", "82", to],
      { env: { ...process.env, LD_LIBRARY_PATH: binaries, DYLD_LIBRARY_PATH: binaries }, stdio: "inherit" },
    );
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`webp encode exited ${code}`))));
  });
}

// version last keeps the player from requesting a half-written render.
export async function installFilms(stagedThemes = ["light", "dark"]) {
  const site = resolve("../wencetongol");
  const versionFile = `${site}/src/lib/reel-version.js`;
  const current = await readFile(versionFile, "utf8").catch(() => "");
  const currentVersion = current.match(/REEL_VERSION = "([^"]+)"/)?.[1];
  const sources = {};
  const hash = createHash("sha256");
  for (const theme of ["light", "dark"]) {
    sources[theme] = {};
    for (const file of ["ads.mp4", "ads.webm", "poster.png"]) {
      const versioned =
        file === "poster.png"
          ? `poster-${currentVersion}.webp`
          : `film-${currentVersion}.${file.split(".")[1]}`;
      const path = stagedThemes.includes(theme)
        ? resolve(`out/${theme}/${file}`)
        : `${site}/public/videos/${theme}/${versioned}`;
      sources[theme][file] = path;
      hash.update(await readFile(path));
    }
  }
  const version = hash.digest("hex").slice(0, 12);
  for (const theme of ["light", "dark"]) {
    const dir = `${site}/public/videos/${theme}`;
    await mkdir(dir, { recursive: true });
    const keep = new Set();
    for (const file of ["ads.mp4", "ads.webm", "poster.png"]) {
      const name =
        file === "poster.png"
          ? `poster-${version}.webp`
          : `film-${version}.${file.split(".")[1]}`;
      keep.add(name);
      const destination = `${dir}/${name}`;
      if (sources[theme][file] === destination) continue;
      if (file === "poster.png" && sources[theme][file].endsWith(".png")) {
        // Freshly rendered stills arrive as png; encode them on the way in.
        await encodeWebp(sources[theme][file], destination);
      } else {
        await copyFile(sources[theme][file], destination);
      }
    }
    for (const name of await readdir(dir)) {
      if (
        !keep.has(name) &&
        /^(ads\.(mp4|webm)|poster\.png|film-[a-f0-9]{12}\.(mp4|webm)|poster-[a-f0-9]{12}\.(png|webp))$/.test(
          name,
        )
      )
        await unlink(`${dir}/${name}`);
    }
  }
  await writeFile(
    versionFile,
    `// Generated from the delivered video and poster bytes.\nexport const REEL_VERSION = "${version}";\n`,
  );
  console.log(`Installed fresh film assets: ${version}`);
  return version;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await installFilms();
