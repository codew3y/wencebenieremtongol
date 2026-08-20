import React, { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import useSmoothAnchors from "./hooks/useSmoothAnchors";
import Home from "./components/Home";
import About from "./components/About";

// Home and About are what the visitor actually lands on; everything below the
// fold ships as its own chunk so the first paint is not waiting on all of it.
// The chunks download while the loading screen is up, so the Suspense fallbacks
// below are rarely seen.
const Skills = lazy(() => import("./components/Skills"));
const Experience = lazy(() => import("./components/Experience"));
const Projects = lazy(() => import("./components/Projects"));
const Education = lazy(() => import("./components/Education"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

// Holds roughly the section's height so the scrollbar does not lurch while a
// chunk lands.
const Placeholder = ({ height }) => (
  <div aria-hidden="true" className={height} />
);

const SectionFailed = ({ id }) => (
  <section id={id} className="mx-auto max-w-6xl px-6 py-20">
    <p className="rounded-xl border border-line bg-surface px-5 py-4 text-sm text-muted">
      This section didn't load. Refreshing usually fixes it — or reach me at{" "}
      <a
        href="mailto:tongolwey@gmail.com"
        className="text-accent hover:underline"
      >
        tongolwey@gmail.com
      </a>
      .
    </p>
  </section>
);

/**
 * One lazy section: its own chunk, its own error boundary. A section that fails
 * to render — or whose chunk fails to load — leaves the rest of the page alone.
 * The fallback keeps the section's id so the nav and deep links still resolve.
 */
const LazySection = ({ id, height = "min-h-[60vh]", children }) => (
  <ErrorBoundary name={id} fallback={<SectionFailed id={id} />}>
    <Suspense fallback={<Placeholder height={height} />}>{children}</Suspense>
  </ErrorBoundary>
);

function App() {
  // Starts open on a hidden tab. Waiting until the effect runs would mount the
  // loader for a frame, and its exit animation needs frames a background tab
  // does not give -- leaving a full-screen overlay in the DOM, swallowing the
  // first click of whoever eventually switches to it.
  const openedHidden =
    typeof document !== "undefined" && document.visibilityState === "hidden";
  const [ready, setReady] = useState(openedHidden);

  // Eased scrolling for every in-page link, once the sections exist to scroll to.
  useSmoothAnchors(ready);

  // Hold the page until the webfonts land, then a beat longer so the loader
  // reads as intentional rather than a flash. The race is a safety net: if
  // fonts.ready never settles, the site still opens.
  //
  // Both timers are skipped entirely while the tab is hidden. A background tab
  // has its timers throttled -- to once a minute once it has been hidden a
  // while -- so these two could hold the loader up for minutes on a link
  // opened in a new tab, which reads as a page that takes minutes to load.
  // Nobody is watching an intro they cannot see, so it is not worth waiting on.
  useEffect(() => {
    let hold = null;
    let cancelled = false;

    const open = () => {
      if (!cancelled) setReady(true);
    };

    if (document.visibilityState === "hidden") {
      open();
      return undefined;
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") open();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();

    Promise.race([
      fonts,
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]).then(() => {
      if (!cancelled) hold = setTimeout(open, 800);
    });

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (hold) clearTimeout(hold);
    };
  }, []);

  // Sections only exist once the loader is done, so a deep link (/#projects)
  // lands on an empty page. Re-apply the hash after the hand-off.
  useEffect(() => {
    if (!ready || !window.location.hash) return;
    try {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: "instant" });
    } catch {
      // A hash that isn't a valid selector is just not a section link.
    }
  }, [ready]);

  return (
    // reducedMotion="user" makes every framer-motion animation below drop its
    // transform and keep only the fade when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      {/* No background here: `body` paints the canvas, so the -z-10 backdrop
          below stays visible instead of being covered by this background. */}
      <div className="relative min-h-screen text-fg">
        {/* Decorative backdrop: blueprint grid behind the fold. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="tech-grid absolute inset-0" />
        </div>

        <AnimatePresence>{!ready && <Loader />}</AnimatePresence>

        {ready && (
          <motion.div
            // No fade when the intro was skipped. The page mounts at once in
            // that case, and a hidden tab gets no frames to run a fade with --
            // so the content would sit at opacity 0 and the page would look
            // blank, which is worse than the loader it replaced.
            initial={openedHidden ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <ErrorBoundary name="chrome">
              <ScrollProgress />

              <a
                href="#home"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-fg"
              >
                Skip to content
              </a>

              <Navbar />
            </ErrorBoundary>

            <main>
              <ErrorBoundary name="home" fallback={<SectionFailed id="home" />}>
                <Home />
              </ErrorBoundary>
              <ErrorBoundary name="about" fallback={<SectionFailed id="about" />}>
                <About />
              </ErrorBoundary>

              <LazySection id="skills">
                <Skills />
              </LazySection>
              <LazySection id="experience">
                <Experience />
              </LazySection>
              <LazySection id="projects">
                <Projects />
              </LazySection>
              <LazySection id="education">
                <Education />
              </LazySection>
              <LazySection id="contact">
                <Contact />
              </LazySection>
            </main>

            <LazySection id="footer" height="min-h-[20vh]">
              <Footer />
            </LazySection>
          </motion.div>
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
