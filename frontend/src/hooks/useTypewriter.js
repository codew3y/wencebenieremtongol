import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Reveals `text` one character at a time.
 *
 * Returns the full string immediately when the visitor prefers reduced motion,
 * so the content is never gated behind an animation they opted out of. That case
 * is derived rather than stored, which keeps the effect free of a synchronous
 * setState and avoids a cascading render.
 */
export default function useTypewriter(text, { speed = 22, startDelay = 0 } = {}) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;

    let typed = 0;
    let interval;

    const start = setTimeout(() => {
      interval = setInterval(() => {
        typed += 1;
        setCount(typed);
        if (typed >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay, reduceMotion]);

  if (reduceMotion) return { typed: text, done: true };
  return { typed: text.slice(0, count), done: count >= text.length };
}
