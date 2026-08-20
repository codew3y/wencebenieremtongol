import { useEffect } from "react";

/**
 * Eased scrolling for in-page links.
 *
 * CSS `scroll-behavior: smooth` animates, but its duration and curve are the
 * browser's own: a jump to the footer travels at the same rate as a jump to the
 * next section, so long trips crawl and short ones snap. This gives every trip
 * the same duration and an ease that settles rather than stops.
 *
 * The landing point is worked out the way the browser does it -- the target's
 * top, less the document's scroll-padding and the target's own scroll-margin --
 * so anchors land exactly where a plain hash jump would.
 */

const DURATION = 620;

// Cubic in-out: leaves slowly, covers the distance, arrives slowly.
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const landingFor = (target) => {
  const padding =
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const top = target.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, top - padding - margin);
};

const useSmoothAnchors = (enabled) => {
  useEffect(() => {
    if (!enabled) return undefined;

    let frame = null;

    const onClick = (event) => {
      // Let the browser handle anything it would normally treat specially.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest?.('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      let target = null;
      try {
        target = document.querySelector(hash);
      } catch {
        return; // Not a valid selector, so not a section link.
      }
      if (!target) return;

      event.preventDefault();

      // Anyone who asked for reduced motion gets the destination, not the trip.
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const to = landingFor(target);
      const from = window.scrollY;

      const finish = () => {
        // Keep the URL and the focus ring honest, the way a real hash jump does.
        history.pushState(null, "", hash);
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.removeAttribute("tabindex");
      };

      if (reduce || Math.abs(to - from) < 2) {
        window.scrollTo(0, to);
        finish();
        return;
      }

      if (frame) cancelAnimationFrame(frame);
      const started = performance.now();

      const step = (now) => {
        const progress = Math.min((now - started) / DURATION, 1);
        window.scrollTo(0, from + (to - from) * ease(progress));
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        } else {
          frame = null;
          finish();
        }
      };

      frame = requestAnimationFrame(step);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);
};

export default useSmoothAnchors;
