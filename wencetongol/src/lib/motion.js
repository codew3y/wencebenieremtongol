/**
 * Shared motion presets.
 *
 * MotionConfig in App.jsx runs with reducedMotion="user", so framer-motion drops
 * the transform part of these for visitors who ask their OS to reduce motion and
 * keeps the opacity fade. Anything hand-rolled (the typewriter, the scroll bar,
 * the timeline draw) has to check useReducedMotion itself.
 */

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

/** Parent wrapper that cascades its children. */
export const stagger = (staggerChildren = 0.06, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Reveal once, slightly before the element is fully on screen. */
export const viewportOnce = { once: true, margin: "-60px" };
