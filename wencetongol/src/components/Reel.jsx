import React, { useEffect, useRef, useState } from "react";
import { TbPlayerPause, TbPlayerPlay } from "react-icons/tb";
import { REEL_VERSION } from "../lib/reel-version";

const CUTS = ["light", "dark"];
const FADE_MS = 240;
const readTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Reel = () => {
  const filmVersion = REEL_VERSION;
  const holder = useRef(null);
  const videos = useRef({});
  const shownRef = useRef(readTheme());
  const [theme, setTheme] = useState(readTheme);
  const [shown, setShown] = useState(readTheme);
  const [readyTheme, setReadyTheme] = useState(null);
  const [reduce, setReduce] = useState(reducedMotion);
  const [armed, setArmed] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [hidden, setHidden] = useState(() => document.hidden);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const update = () => {
      const next = readTheme();
      setTheme(next);
    };
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduce(media.matches);
    const visibility = () => setHidden(document.hidden);
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    const node = holder.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setArmed(true);
      },
      { rootMargin: "200px" },
    );
    const onscreen = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    nearby.observe(node);
    onscreen.observe(node);
    return () => {
      nearby.disconnect();
      onscreen.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!armed || reduce) return undefined;
    const incoming = videos.current[theme];
    const outgoing = videos.current[shownRef.current];
    if (!incoming) return undefined;
    // Warm both lightweight cuts near the viewport for a prompt theme switch.
    // Inserting sources into mounted videos needs explicit resource selection.
    for (const cut of CUTS) {
      const video = videos.current[cut];
      if (video && video.dataset.loaded !== filmVersion) {
        video.dataset.loaded = filmVersion;
        video.load();
      }
    }
    let cancelled = false;
    const cleanup = [];
    const waitFor = (event) =>
      new Promise((resolve) => {
        const handler = () => {
          incoming.removeEventListener(event, handler);
          resolve();
        };
        incoming.addEventListener(event, handler, { once: true });
        cleanup.push(() => incoming.removeEventListener(event, handler));
      });
    const sync = async () => {
      if (incoming.readyState < 1) await waitFor("loadedmetadata");
      if (cancelled) return;
      const time = outgoing?.currentTime || 0;
      if (
        Number.isFinite(incoming.duration) &&
        Math.abs(incoming.currentTime - time) > 0.08
      ) {
        const seeked = waitFor("seeked");
        incoming.currentTime = time % incoming.duration;
        await seeked;
      }
      if (cancelled) return;
      if (incoming.readyState < 3) await waitFor("canplay");
      if (!cancelled) {
        shownRef.current = theme;
        setShown(theme);
        setReadyTheme(theme);
      }
    };
    sync().catch(() => {});
    return () => {
      cancelled = true;
      cleanup.forEach((remove) => remove());
    };
  }, [theme, armed, reduce, filmVersion]);

  useEffect(() => {
    const active = videos.current[shown];
    const inactive = videos.current[shown === "dark" ? "light" : "dark"];
    if (!active) return undefined;
    if (reduce || !playing || !visible || hidden) {
      active.pause();
      inactive?.pause();
      return undefined;
    }
    active.play().catch(() => {});
    const stop = setTimeout(() => inactive?.pause(), FADE_MS);
    return () => clearTimeout(stop);
  }, [shown, readyTheme, reduce, playing, visible, hidden, armed, filmVersion]);

  return (
    <div
      ref={holder}
      onDragStart={(event) => event.preventDefault()}
      className="card-edge relative select-none overflow-hidden rounded-[var(--r-container)] border border-line bg-canvas-2"
    >
      <div className="relative isolate aspect-video w-full">
        {/* The requested theme appears immediately while a new cut seeks. */}
        <img
          src={`/videos/${theme}/poster-${filmVersion}.png`}
          alt="Wence Tongol, full-stack developer. Portfolio motion film."
          aria-hidden={!reduce && readyTheme === theme}
          draggable={false}
          width={1920}
          height={1080}
          className="pointer-events-none absolute inset-0 block h-full w-full select-none"
        />
        {!reduce &&
          CUTS.map((cut) => (
            <video
              key={`${cut}-${filmVersion}`}
              ref={(node) => {
                videos.current[cut] = node;
              }}
              draggable={false}
              muted
              loop
              playsInline
              preload={armed ? "auto" : "none"}
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
              x-webkit-airplay="deny"
              poster={`/videos/${cut}/poster-${filmVersion}.png`}
              aria-hidden={cut !== shown}
              aria-label={
                cut === shown
                  ? "A 30-second motion film: Wence Tongol, web products, enterprise integrations and VistaVR"
                  : undefined
              }
              style={{
                opacity:
                  cut === theme && cut === shown && readyTheme === theme
                    ? 1
                    : 0,
                transition: `opacity ${FADE_MS}ms ease`,
              }}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
            >
              {armed && (
                <>
                  <source
                    src={`/videos/${cut}/film-${filmVersion}.webm`}
                    type="video/webm"
                  />
                  <source
                    src={`/videos/${cut}/film-${filmVersion}.mp4`}
                    type="video/mp4"
                  />
                </>
              )}
            </video>
          ))}
      </div>
      {!reduce && (
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause portfolio film" : "Play portfolio film"}
          className="pressable absolute top-3 right-3 z-10 grid h-7 w-7 place-items-center rounded-full border border-line bg-canvas-2/90 text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {playing ? <TbPlayerPause size={13} /> : <TbPlayerPlay size={13} />}
        </button>
      )}
    </div>
  );
};
export default Reel;
