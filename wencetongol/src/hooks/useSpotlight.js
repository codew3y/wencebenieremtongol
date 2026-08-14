import { useCallback } from "react";

/**
 * Feeds the pointer's position to the `.spotlight` class in index.css.
 *
 * The values are written straight onto the node as custom properties rather
 * than held in state: a card glow that re-rendered React on every mousemove
 * would be a lot of work for a decoration.
 *
 * Usage: spread the handler on a card that also carries the `spotlight` class.
 */
const useSpotlight = () =>
  useCallback((event) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }, []);

export default useSpotlight;
