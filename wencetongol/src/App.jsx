import React from "react";
import Navbar from "./components/Navbar";
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
    // No background here: `body` paints the canvas, so the -z-10 backdrop below
    // stays visible instead of being covered by this element's own background.
    <div className="relative min-h-screen text-fg">
      {/* Decorative backdrop: blueprint grid + accent glow behind the fold. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="tech-grid absolute inset-0" />
        <div className="tech-glow absolute inset-x-0 top-0 h-[70vh]" />
      </div>

      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-fg"
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
  );
}

export default App;
