import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_IN_OUT, EASE_OUT } from "../lib/motion";

/**
 * First-paint screen.
 *
 * The previous version was two counter-rotating arcs with the word "Loading"
 * pulsing underneath. A circular spinner is the default every generated site
 * reaches for, and it says nothing except that something is happening, which
 * the visitor can already tell.
 *
 * This one introduces the site instead of stalling in front of it: the name
 * wipes in behind a travelling mask, a hairline rule draws underneath it, and
 * the whole thing lifts away. No spinner, no percentage counter, no "Loading".
 * The screen reader still gets a status message, because the visual has none.
 */

const WORD = "WENCE TONGOL";

const Loader = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center bg-canvas"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.7, ease: EASE_IN_OUT }}
    >
      <span className="sr-only">Loading</span>

      {/* Grain, matching the page behind it, so the hand-off does not change
          the texture of the background. */}
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

      {/* Centred. */}
      <div className="relative mx-auto w-full max-w-5xl px-6 text-center">
        <div className="overflow-hidden">
          <motion.h1
            initial={reduceMotion ? { opacity: 0 } : { y: "110%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: "0%" }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
            className="text-[13vw] leading-[0.85] font-semibold tracking-[-0.045em] text-fg sm:text-[9vw]"
          >
            {WORD}
          </motion.h1>
        </div>

        {/* The rule is the only progress indication, and it is honest about
            being decorative: it draws once, at the pace of the hold. */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, ease: EASE_IN_OUT, delay: 0.3 }}
          className="mt-6 h-px w-full origin-center bg-accent"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.7 }}
          className="mt-5 font-mono text-xs tracking-[0.18em] text-faint uppercase"
        >
          Full-stack developer
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loader;
