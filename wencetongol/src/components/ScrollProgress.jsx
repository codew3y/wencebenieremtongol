import React from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Thin accent bar across the top tracking read position.
 */
const ScrollProgress = () => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // The spring is the whole point of the effect, but it is also exactly the
  // kind of continuous motion reduced-motion users are asking to avoid, so
  // track scroll position directly for them.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduceMotion ? scrollYProgress : smooth }}
      className="fixed top-0 left-0 z-[60] h-0.5 w-full origin-left bg-accent"
    />
  );
};

export default ScrollProgress;
