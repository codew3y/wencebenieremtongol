// WCAG 2.x contrast check for every text/background pair used in the video.
const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255);
const lum = (h) => { const [r, g, b] = hex(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const T = {
  light: { bg: '#ffffff', surface: '#fafafa', fg: '#18181b', muted: '#52525b', faint: '#63636d', accent: '#1d4ed8', accentFg: '#ffffff', brand: '#765712', brandFg: '#ffffff' },
  dark: { bg: '#101013', surface: '#0b0b0d', fg: '#eaeaef', muted: '#a1a1aa', faint: '#85858f', accent: '#60a5fa', accentFg: '#07203f', brand: '#d9bc72', brandFg: '#080706' },
};
let ok = true;
for (const [name, t] of Object.entries(T)) {
  const pairs = [['fg', 'bg'], ['muted', 'bg'], ['faint', 'bg'], ['accent', 'bg'], ['muted', 'surface'], ['accentFg', 'accent'], ['brand', 'bg'], ['brandFg', 'brand']];
  for (const [a, b] of pairs) { const r = ratio(t[a], t[b]); if (r < 4.5) ok = false; console.log(`${name.padEnd(5)} ${a.padEnd(8)} on ${b.padEnd(7)} ${r.toFixed(2)}:1 ${r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : 'FAIL'}`); }
}
process.exit(ok ? 0 : 1);
