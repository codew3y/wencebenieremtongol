import React from "react";

/**
 * Decorative outline of the Philippine archipelago, drawn in `currentColor` so
 * it inherits the accent from whatever wraps it and swaps with the theme.
 *
 * Coordinates come from a plain lon/lat projection onto the viewBox:
 * x = (lon - 116) * 33.33, y = (21 - lat) * 33.33 — enough vertices to keep the
 * landmarks (Lingayen Gulf, the Bicol arm, Davao Gulf) readable, no more.
 */

const islands = [
  // Luzon — Ilocos coast, Lingayen Gulf, Bataan, Manila Bay, then the Bicol arm.
  "M152 82 L170 80 L188 87 L205 83 L217 130 L213 153 L205 160 L185 175 L180 187 L188 208 L192 227 L198 233 L223 235 L228 224 L240 228 L250 242 L262 242 L263 255 L258 262 L270 270 L263 280 L253 270 L247 263 L230 250 L217 243 L197 238 L187 237 L168 242 L155 232 L157 221 L163 211 L150 206 L148 219 L145 207 L132 187 L128 170 L130 153 L145 167 L143 147 L147 113 L153 93 Z",
  // Catanduanes
  "M274 235 L281 232 L280 248 L271 246 Z",
  // Mindoro
  "M155 250 L183 252 L185 270 L177 282 L163 292 L152 275 L143 265 Z",
  // Palawan
  "M125 317 L133 322 L120 338 L97 360 L70 395 L42 420 L35 415 L63 388 L90 365 Z",
  // Masbate
  "M238 287 L270 290 L265 302 L250 300 Z",
  // Samar
  "M285 283 L303 282 L317 290 L320 303 L313 317 L297 325 L280 308 Z",
  // Panay
  "M198 308 L225 313 L238 315 L230 337 L219 343 L198 348 L197 328 Z",
  // Leyte
  "M278 315 L297 318 L303 328 L308 347 L302 367 L293 362 L283 347 L278 337 L276 327 Z",
  // Cebu
  "M267 323 L268 337 L263 357 L258 383 L253 360 L258 337 Z",
  // Bohol
  "M262 367 L272 362 L287 363 L287 377 L273 382 L263 378 Z",
  // Negros
  "M238 337 L247 350 L244 390 L235 398 L227 388 L227 368 L232 344 Z",
  // Mindanao — Surigao down the east coast, Davao Gulf, then Zamboanga.
  "M317 373 L347 413 L345 427 L341 468 L340 491 L320 464 L311 475 L307 505 L306 497 L297 497 L283 492 L268 478 L275 459 L267 453 L268 447 L244 447 L202 470 L198 470 L203 457 L245 413 L259 417 L275 425 L288 418 L303 405 L318 402 Z",
];

// Marinduque through the Sulu chain: too small to outline, but the archipelago
// reads wrong without them. Batanes is left off — it sits so far north of Luzon
// that including it would shrink everything else inside the frame.
const specks = [
  { cx: 200, cy: 253, r: 5 },
  { cx: 200, cy: 288, r: 4 },
  { cx: 222, cy: 346, r: 3 },
  { cx: 335, cy: 372, r: 3 },
  { cx: 290, cy: 394, r: 2.5 },
  { cx: 202, cy: 482, r: 4 },
  { cx: 167, cy: 498, r: 3 },
  { cx: 132, cy: 527, r: 2.5 },
];

// The viewBox is trimmed to the drawn coastline (x 33-353, y 78-527) so the
// archipelago fills its frame instead of floating inside projection margins.
const PhilippinesMap = ({ className = "" }) => {
  return (
    <svg
      viewBox="28 68 334 472"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g
        fill="currentColor"
        fillOpacity="0.07"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinejoin="round"
      >
        {islands.map((d) => (
          <path key={d} d={d} />
        ))}
        {specks.map((speck) => (
          <circle key={`${speck.cx}-${speck.cy}`} {...speck} />
        ))}
      </g>

      {/* Pampanga, where I'm based. */}
      <g transform="translate(157 198)">
        <circle r="9" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        <circle r="3.2" fill="currentColor" fillOpacity="0.9" />
      </g>
    </svg>
  );
};

export default PhilippinesMap;
