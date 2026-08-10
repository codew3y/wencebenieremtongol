import React from "react";
import { MotionConfig } from "framer-motion";
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
      </div>
    </MotionConfig>
  );
}

export default App;
