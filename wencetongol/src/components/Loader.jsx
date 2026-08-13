import React from "react";
import { motion } from "framer-motion";

/**
 * First-paint loading screen, modelled on markyisulat.dev: two counter-rotating
 * arcs behind a pulsing wordmark, leaving as a fade to blur. Colours come from
 * our own tokens -- accent for the outer ring, the same accent at half strength
 * for the inner one, and --glow (accent-derived) for the halo -- so it reads as
 * part of this site in both themes.
 */
const Loader = () => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas/80 backdrop-blur-sm"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center justify-center gap-6">
        <div className="relative flex items-center justify-center">
          <motion.div
            className="h-16 w-16 rounded-full border-t-2 border-l-2 border-accent"
            style={{ boxShadow: "0 0 20px var(--glow)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute h-12 w-12 rounded-full border-r-2 border-b-2 border-accent/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.p
          className="font-mono text-xl tracking-[0.2em] text-accent uppercase md:text-2xl"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loader;
