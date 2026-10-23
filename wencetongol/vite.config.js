import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The film's filenames carry a content hash, and index.html needs it so the
// poster can be preloaded before the bundle has parsed. Reading it from the
// module the render script writes keeps one source of truth: a new render
// changes the hash in one place and the HTML follows, rather than silently
// preloading a film that no longer exists.
const reelVersion = () => {
  const source = readFileSync('src/lib/reel-version.js', 'utf8')
  const match = source.match(/REEL_VERSION\s*=\s*"([0-9a-f]+)"/)
  if (!match) throw new Error('Could not read REEL_VERSION from src/lib/reel-version.js')
  return match[1]
}

const injectReelVersion = () => ({
  name: 'inject-reel-version',
  transformIndexHtml: (html) => html.replaceAll('%REEL_VERSION%', reelVersion()),
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), injectReelVersion()],
})
