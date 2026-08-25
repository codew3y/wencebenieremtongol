import React from "react";
import { motion } from "framer-motion";

/**
 * Shared section shell: mono label, title, optional intro, then content.
 */
const Section = ({ id, label, title, intro, children }) => {
  return (
    // A jump lands the heading just under the header rather than a screen
    // below it. The maths: the landing point is scroll-padding (0.5rem) plus
    // this margin, and the heading sits one section-padding below that -- 80px
    // at this size, 112px from md. So mobile needs no pull and md needs -2rem,
    // both leaving the heading about 24px clear of the header.
    <section
      id={id}
      className="mx-auto max-w-6xl px-6 py-20 md:py-28 md:-scroll-mt-8"
    >
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <p className="font-mono text-xs tracking-[0.2em] text-accent sm:whitespace-nowrap">
            {label}
          </p>
          <span className="h-px flex-1 bg-line" />
        </div>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-fg md:text-4xl">
          {title}
        </h2>

        {intro && (
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{intro}</p>
        )}
      </motion.header>

      <div className="mt-10">{children}</div>
    </section>
  );
};

export default Section;
