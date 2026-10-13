import React, { useEffect, useRef, useState } from "react";

/**
 * The hero reel, in the right column.
 *
 * Two cuts exist, one per theme, and the hard part is the swap. Remounting the
 * <video> when the theme changes -- or keying it on the theme -- drops the
 * element, restarts the new file at zero and shows a frame of nothing in
 * between. The theme toggle sits a few hundred pixels from this panel, so that
 * jump is the first thing anyone would notice.
 *
 * So both cuts are mounted and stacked, and the theme only decides which one
 * is opaque. Before the fade begins the incoming video is seeked to the
 * outgoing one's position and started, so the two are showing the same moment
 * of the same reel and the cross-fade reads as the picture recolouring rather
 * than as one video replacing another.
 *
 * Costs are kept down by loading nothing until the panel is near the viewport,
 * by only ever playing the visible cut, and by not fetching the second cut at
 * all until the theme has actually changed once.
 */

const CUTS = {
  light: {
    poster: "/videos/light/poster.png",
    webm: "/videos/light/ads.webm",
    mp4: "/videos/light/ads.mp4",
  },
  dark: {
    poster: "/videos/dark/poster.png",
    webm: "/videos/dark/ads.webm",
    mp4: "/videos/dark/ads.mp4",
  },
};

const FADE_MS = 420;

// The theme as the page actually expresses it. ThemeToggle writes both the
// class and colorScheme on <html> but fires no event, so this reads it
// directly and watches it with a MutationObserver.
const readTheme = () => {
  if (typeof document === "undefined") return "dark";
  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  const scheme = root.style.colorScheme;
  if (scheme === "dark" || scheme === "light") return scheme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

const Reel = () => {
  const holder = useRef(null);
  const lightRef = useRef(null);
  const darkRef = useRef(null);

  const [theme, setTheme] = useState(readTheme);
  const [reduce, setReduce] = useState(prefersReducedMotion);
  // A browser with no observer has no way to be clever about this, so it
  // simply loads; deciding that at init avoids a second render.
  const [armed, setArmed] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  // The second cut is only fetched once the visitor has toggled, so anyone who
  // never touches the theme downloads one video rather than two.
  const [loaded, setLoaded] = useState(() => ({ [readTheme()]: true }));

  const refFor = (cut) => (cut === "dark" ? darkRef : lightRef);

  // Follow the page's theme. Marking the new cut as loaded happens here, in
  // the observer's callback, rather than in an effect reacting to `theme` --
  // same result, without a second render pass chasing the first.
  useEffect(() => {
    const update = () => {
      const next = readTheme();
      setTheme(next);
      setLoaded((current) =>
        current[next] ? current : { ...current, [next]: true },
      );
    };
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Load only when the panel is near the screen, and play only while it is on
  // it. A looping video in a scrolled-past hero is a decoded frame every 33ms
  // for nobody.
  useEffect(() => {
    if (reduce) return undefined;
    const node = holder.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setArmed(true);
        const element = (theme === "dark" ? darkRef : lightRef).current;
        if (!element) return;
        if (entry.isIntersecting) {
          // A refused play() is normal; the poster stays and nothing breaks.
          element.play().catch(() => {});
        } else {
          element.pause();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce, theme]);

  // The swap: match the incoming cut to the outgoing one's position and start
  // it, so the fade happens between two videos showing the same moment.
  useEffect(() => {
    if (!armed || reduce) return undefined;

    const incoming = (theme === "dark" ? darkRef : lightRef).current;
    const outgoing = (theme === "dark" ? lightRef : darkRef).current;
    if (!incoming) return undefined;

    if (outgoing && !outgoing.paused) {
      const at = outgoing.currentTime;
      try {
        if (Number.isFinite(at)) incoming.currentTime = at;
      } catch {
        // Seeking past what is buffered throws; zero is still a valid frame
        // of the same reel, so the fade is still between two matching cuts.
      }
    }

    incoming.play().catch(() => {});

    // The outgoing cut keeps playing until the fade is over, so there is never
    // a frozen frame showing underneath the one coming in.
    const stop = setTimeout(() => {
      if (outgoing && outgoing !== incoming) outgoing.pause();
    }, FADE_MS);

    return () => clearTimeout(stop);
  }, [theme, armed, reduce, loaded]);

  if (reduce) {
    return (
      <div className="card-edge overflow-hidden rounded-[var(--r-container)] border border-line bg-canvas-2">
        <img
          src={CUTS[theme].poster}
          alt="Wence Tongol, full-stack developer. A still from the portfolio reel."
          width={1920}
          height={1080}
          className="block w-full"
        />
      </div>
    );
  }

  return (
    <div
      ref={holder}
      className="card-edge relative isolate overflow-hidden rounded-[var(--r-container)] border border-line bg-canvas-2"
    >
      {/* Holds the 16:9 box, so the column never reflows between poster and
          video or during the swap. */}
      <div className="relative aspect-video w-full">
        {Object.keys(CUTS).map((cut) => (
          <video
            key={cut}
            ref={refFor(cut)}
            muted
            loop
            playsInline
            preload="none"
            // No browser chrome of any kind. Chrome floats a
            // picture-in-picture button over a playing video on hover and Edge
            // adds its "enhance video" menu beside it; both appear without
            // `controls` ever being set, and both sit on top of a reel that is
            // meant to read as part of the page rather than as a media player.
            // The attributes refuse each feature, and pointer-events:none means
            // the hover that summons them never reaches the element.
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            x-webkit-airplay="deny"
            poster={CUTS[cut].poster}
            aria-hidden={cut !== theme}
            aria-label={
              cut === theme
                ? "A looping reel of the portfolio: the work, the projects and the stack"
                : undefined
            }
            style={{ transitionDuration: `${FADE_MS}ms` }}
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] ${
              cut === theme ? "opacity-100" : "opacity-0"
            }`}
          >
            {armed && loaded[cut] && (
              <>
                <source src={CUTS[cut].webm} type="video/webm" />
                <source src={CUTS[cut].mp4} type="video/mp4" />
              </>
            )}
          </video>
        ))}
      </div>
    </div>
  );
};

export default Reel;
