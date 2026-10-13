import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "../lib/motion";

/**
 * A number that rolls into place, one digit at a time.
 *
 * Each digit is a vertical strip of 0-9 listed twice behind a 1em window. The
 * strip starts at the top and travels a full cycle plus the distance to its
 * own digit, so what you see is a spin that lands rather than a value counting
 * up -- the difference between a mechanical counter and a progress number.
 *
 * Digits are staggered left to right, so a two-digit figure settles the way a
 * split-flap board does instead of snapping in one piece.
 *
 * Only `transform` animates, so none of this causes layout or paint work. The
 * real value is exposed to assistive tech by the caller; the roll itself is
 * decoration and is hidden from it.
 */

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
// Listed twice so there is a whole revolution to travel before landing.
const STRIP = [...DIGITS, ...DIGITS];

const Digit = ({ digit, delay, reduce }) => {
  // 10 rows for the first cycle, then however far into the second the digit is.
  const target = 10 + Number(digit);

  return (
    <span className="relative inline-block h-[1em] overflow-hidden leading-none tabular-nums">
      <motion.span
        className="block"
        initial={{ y: "0em" }}
        animate={{ y: `-${target}em` }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 1.15, ease: EASE_OUT, delay }
        }
      >
        {STRIP.map((value, index) => (
          <span
            // Index is the right key here: the strip is a fixed ruler of
            // positions, not a list of items that can reorder.
            key={index}
            className="block h-[1em] leading-none"
          >
            {value}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

const Odometer = ({ value, delay = 0 }) => {
  const reduce = useReducedMotion();

  // The stagger counts digits only, so a "+" between figures does not consume
  // a beat and leave a visible gap in the sequence. Resolved in one pass up
  // front rather than by a counter inside the map, which would be a mutation
  // during render.
  const characters = [];
  let seen = 0;
  for (const character of String(value)) {
    const isDigit = /\d/.test(character);
    characters.push({ character, isDigit, order: isDigit ? seen : null });
    if (isDigit) seen += 1;
  }

  return (
    <span aria-hidden="true" className="inline-flex items-end">
      {characters.map((item, index) =>
        item.isDigit ? (
          <Digit
            key={index}
            digit={item.character}
            delay={delay + item.order * 0.09}
            reduce={reduce}
          />
        ) : (
          <span key={index} className="leading-none">
            {item.character}
          </span>
        ),
      )}
    </span>
  );
};

export default Odometer;
