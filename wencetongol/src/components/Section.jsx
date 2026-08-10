import React from "react";
import { motion } from "framer-motion";

/**
 * Shared section shell: mono index label, title, optional intro, then content.
 */
const Section = ({ id, index, label, title, intro, children }) => {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <p className="font-mono text-xs tracking-[0.2em] whitespace-nowrap text-accent">
            <span className="text-faint">{index}</span> // {label}
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
