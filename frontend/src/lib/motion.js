/**
 * Shared motion presets.
 *
 * MotionConfig in App.jsx runs with reducedMotion="user", so framer-motion drops
 * the transform part of these for visitors who ask their OS to reduce motion and
 * keeps the opacity fade. Anything hand-rolled (the typewriter, the scroll bar,
 * the timeline draw) has to check useReducedMotion itself.
 */

/**
 * Easing curves, per Emil Kowalski's animation standards: the built-in CSS and
 * framer-motion easings ("easeOut", "easeInOut") are too weak to read as
 * intentional. These are the strong equivalents.
 *
 * Entering or exiting -> EASE_OUT. Moving or morphing on screen -> EASE_IN_OUT.
 * Never ease-in on UI: it starts slow, which delays the exact moment the user
 * is watching.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT = [0.77, 0, 0.175, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

/** Parent wrapper that cascades its children. */
export const stagger = (staggerChildren = 0.06, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Reveal once, slightly before the element is fully on screen. */
export const viewportOnce = { once: true, margin: "-60px" };
