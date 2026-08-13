import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const [ready, setReady] = useState(false);

  // Hold the page until the webfonts land, then a beat longer so the loader
  // reads as intentional rather than a flash. The race is a safety net: if
  // fonts.ready never settles, the site still opens.
  useEffect(() => {
    let hold = null;
    let cancelled = false;

    const fonts = document.fonts
      ? document.fonts.ready
      : Promise.resolve();

    Promise.race([
      fonts,
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]).then(() => {
      if (!cancelled) hold = setTimeout(() => setReady(true), 800);
    });

    return () => {
      cancelled = true;
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
        {/* Decorative backdrop: blueprint grid + accent glow behind the fold. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="tech-grid absolute inset-0" />
          <div className="tech-glow absolute inset-x-0 top-0 h-[70vh]" />
        </div>

        <AnimatePresence>{!ready && <Loader />}</AnimatePresence>

        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <ScrollProgress />

            <a
              href="#home"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-fg"
            >
              Skip to content
            </a>

            <Navbar />

            <main>
              <Hero />
              <About />
              <Skills />
              <Experience />
              <Projects />
              <Education />
              <Contact />
            </main>

            <Footer />
          </motion.div>
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
