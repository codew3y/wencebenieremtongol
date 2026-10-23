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
import sharp from "sharp";
import { pathToFileURL } from "node:url";

// Install immutable filenames only after every cut is encoded. Publishing the
// version last keeps the player from requesting a half-written render.
export async function installFilms(stagedThemes = ["light", "dark"]) {
  const site = resolve("../frontend");
  const versionFile = `${site}/src/lib/reel-version.js`;
  const current = await readFile(versionFile, "utf8").catch(() => "");
  const currentVersion = current.match(/REEL_VERSION = "([^"]+)"/)?.[1];
  const sources = {};
  const hash = createHash("sha256");
  for (const theme of ["light", "dark"]) {
    sources[theme] = {};
    for (const file of ["ads.mp4", "ads.webm", "poster.jpg"]) {
      const versioned =
        file === "poster.jpg"
          ? `poster-${currentVersion}.jpg`
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
    for (const file of ["ads.mp4", "ads.webm", "poster.jpg"]) {
      const name =
        file === "poster.jpg"
          ? `poster-${version}.jpg`
          : `film-${version}.${file.split(".")[1]}`;
      keep.add(name);
      const destination = `${dir}/${name}`;
      if (sources[theme][file] !== destination)
        await copyFile(sources[theme][file], destination);
    }
    // The reel draws its opening frame from a WebP sized to the card rather
    // than the 1920x1080 JPEG, which was 90KB for a box 362px wide on a phone.
    // The widths match the srcset in Reel.jsx and the preload in index.html --
    // all three have to agree or the browser fetches a file the element will
    // not use. The JPEG stays for the social card and as the source here.
    const posterJpeg = `${dir}/poster-${version}.jpg`;
    for (const [width, suffix] of [
      [640, "-sm"],
      [960, "-md"],
      [1280, ""],
    ]) {
      const name = `poster-${version}${suffix}.webp`;
      keep.add(name);
      await sharp(posterJpeg)
        .resize({ width })
        .webp({ quality: 80, effort: 6 })
        .toFile(`${dir}/${name}`);
    }

    for (const name of await readdir(dir)) {
      if (
        !keep.has(name) &&
        /^(ads\.(mp4|webm)|poster\.(png|jpg)|film-[a-f0-9]{12}\.(mp4|webm)|poster-[a-f0-9]{12}(-sm|-md)?\.(png|webp|jpg))$/.test(
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
