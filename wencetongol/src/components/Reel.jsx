import React, { useEffect, useRef, useState } from "react";
import { TbPlayerPause, TbPlayerPlay } from "react-icons/tb";
import { REEL_VERSION } from "../lib/reel-version";

const CUTS = ["light", "dark"];
// Module scope on purpose: StrictMode mounts twice in development, and a
// per-instance ref would let each mount print the same advice again.
const warned = new Set();
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
  // What the visitor asked for.
  const [playing, setPlaying] = useState(true);
  // What the element is actually doing. These are not the same thing:
  // a browser that requires a gesture refuses the opening play(), so the
  // film sits on its poster while `playing` still says true. The button
  // then offers to pause something that was never running, the first tap
  // does nothing visible, and the film looks broken.
  const [running, setRunning] = useState(false);
  // Which version failed to decode, rather than a bare boolean: a new render
  // means new filenames, and storing the version means the next one starts
  // clean without an effect to reset it.
  //
  // The poster underneath is already the fallback -- a cut only fades in once
  // it reaches canplay -- so this exists to say so out loud, not to change
  // what is drawn.
  // Cuts whose WebM failed to decode, and which should retry on H.264.
  // Cuts whose files should exist in the tree. The second only joins once the
  // visitor has switched theme, so the first load fetches one film, not two.
  const [wanted, setWanted] = useState(() => [readTheme()]);
  const [h264Only, setH264Only] = useState([]);
  const [failedVersion, setFailedVersion] = useState(null);
  const failed = failedVersion === filmVersion;

  useEffect(() => {
    const update = () => {
      const next = readTheme();
      setTheme(next);
      setWanted((current) =>
        current.includes(next) ? current : [...current, next],
      );
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

  // A failed cut used to be completely silent: play() rejections are swallowed
  // and <video> does not throw. The poster simply stayed up, which looks
  // identical to a film that is merely paused.
  //
  // The usual cause in development is a stale tab asking for a previous
  // REEL_VERSION. Vite answers an unknown path with index.html and a 200, so
  // the element receives an HTML document, cannot decode it, and gives up --
  // reported here as MEDIA_ERR_SRC_NOT_SUPPORTED rather than as a 404.
  const reportFailure = (cut) => (event) => {
    // A <source> that gets skipped fires its own error, and React bubbles it
    // up to this handler on the <video>. That is not a failure -- it is the
    // fallback working, and the next source is about to play. Only an error
    // raised by the element itself means every candidate is exhausted.
    if (event.target !== event.currentTarget) return;

    const code = event.currentTarget?.error?.code ?? 0;

    // A decode error means a source was chosen and then could not be played --
    // most often VP9 on a machine with no VP9 decoder. Drop the WebM for this
    // cut and let it reload on H.264 alone, which is the one codec every
    // browser that ships video can handle. Only the first failure retries; if
    // H.264 fails too there is nothing further to try.
    if (code === 3 && !h264Only.includes(cut)) {
      setH264Only((current) =>
        current.includes(cut) ? current : [...current, cut],
      );
      return;
    }

    setFailedVersion(filmVersion);

    // The event fires once per failed source, so without this the same advice
    // is printed twice for one broken cut.
    const seen = `${cut}-${filmVersion}`;
    if (warned.has(seen)) return;
    warned.add(seen);

    // MEDIA_ERR_* is only populated once a source was selected and then went
    // wrong. When every <source> is rejected outright the element reports no
    // error at all, and that absence is itself the signal: nothing playable
    // was found at either URL.
    const reason =
      code === 2
        ? "network error"
        : code === 3
          ? "decode error"
          : "no playable source. In development this usually means a stale tab is asking for a previous REEL_VERSION: the dev server answers an unknown path with index.html and a 200, so the element is handed HTML. Hard reload, or restart the dev server";
    console.warn(
      `[reel] the ${cut} cut did not load -- ${reason}. Tried ` +
        `/videos/${cut}/film-${filmVersion}.` +
        `${h264Only.includes(cut) ? "mp4" : "webm and .mp4"}`,
    );
  };

  // Re-run source selection for a cut that has just dropped its WebM.
  // Removing the element from the tree is not enough: a <video> that has
  // already failed keeps its error until load() is called again.
  useEffect(() => {
    for (const cut of h264Only) {
      const video = videos.current[cut];
      if (!video) continue;
      video.dataset.loaded = `${filmVersion}-h264`;
      video.load();
    }
  }, [h264Only, filmVersion]);

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
    // Only the cut being shown. Warming both doubled the page: a visitor
    // downloaded two films and two posters to watch one of them, which on this
    // page was more bytes than everything else put together. The other cut is
    // fetched when the theme actually changes, which costs a beat on the first
    // switch and nothing at all for the visitors who never switch.
    const video = videos.current[theme];
    if (video && video.dataset.loaded !== filmVersion) {
      video.dataset.loaded = filmVersion;
      video.load();
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

  // Autoplay is refused on plenty of devices: iOS in Low Power Mode, Safari's
  // per-site setting, any tab the visitor has not interacted with. The
  // attribute and the effect both ask, and when both are refused the film sits
  // on its poster until someone finds the button.
  //
  // Browsers lift the restriction on the first real interaction anywhere on
  // the page, so that is taken as the cue to start. The listener removes
  // itself once it has fired, and never overrides a visitor who chose pause.
  useEffect(() => {
    if (reduce || running || !playing) return undefined;
    const start = () => {
      const active = videos.current[shown];
      if (active && active.paused) active.play().catch(() => {});
    };
    const events = ["pointerdown", "touchstart", "keydown", "wheel"];
    for (const name of events) {
      document.addEventListener(name, start, { once: true, passive: true });
    }
    return () => {
      for (const name of events) document.removeEventListener(name, start);
    };
  }, [reduce, running, playing, shown]);

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
          src={`/videos/${theme}/poster-${filmVersion}.jpg`}
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
              onError={reportFailure(cut)}
              onPlay={() => cut === shown && setRunning(true)}
              onPause={() => cut === shown && setRunning(false)}
              autoPlay
              muted
              loop
              playsInline
              preload={armed && wanted.includes(cut) ? "auto" : "none"}
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
              x-webkit-airplay="deny"
              poster={`/videos/${cut}/poster-${filmVersion}.jpg`}
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
              {armed && wanted.includes(cut) && (
                <>
                  {/* The codec, not just the container. Asked only about
                      "video/webm" a browser answers on the container alone,
                      selects this source, and discovers it has no VP9 decoder
                      only once decoding begins -- at which point the MP4
                      below is no longer a candidate and the film freezes on
                      its poster. Naming vp9 lets it decline honestly and fall
                      through. */}
                  {/* H.264 first, deliberately. A browser is asked what it
                      can play and answers on capability, not on whether the
                      decoder actually works: this film froze on a machine that
                      reported "probably" for VP9 and then raised a decode
                      error on every frame. There is no way to tell those
                      machines apart in advance, so the universally decodable
                      codec goes first and VP9 is only a fallback. It costs
                      about half a megabyte against never failing. */}
                  <source
                    src={`/videos/${cut}/film-${filmVersion}.mp4`}
                    type='video/mp4; codecs="avc1.64001F"'
                  />
                  {!h264Only.includes(cut) && (
                    <source
                      src={`/videos/${cut}/film-${filmVersion}.webm`}
                      type='video/webm; codecs="vp9"'
                    />
                  )}
                </>
              )}
            </video>
          ))}
      </div>
      {!reduce && !failed && (
        <button
          type="button"
          onClick={() => {
            // Drive the element directly and synchronously: by the time an
            // effect runs, the gesture has expired and iOS rejects play().
            const active = videos.current[shown];
            const next = !running;
            setPlaying(next);
            if (!active) return;
            if (next) active.play().catch(() => {});
            else active.pause();
          }}
          aria-label={running ? "Pause portfolio film" : "Play portfolio film"}
          className="pressable absolute top-3 right-3 z-10 grid h-7 w-7 place-items-center rounded-full border border-line bg-canvas-2/90 text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {running ? <TbPlayerPause size={13} /> : <TbPlayerPlay size={13} />}
        </button>
      )}
    </div>
  );
};
export default Reel;
