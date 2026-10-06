import React from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "../lib/motion";

/**
 * Shared section shell: title, optional intro, then content.
 *
 * There is deliberately no eyebrow here. Every section used to open with a
 * small mono label above its heading ("about", "skills", "experience"), which
 * gave all seven sections an identical rhythm and is the clearest tell that a
 * page was generated rather than composed. The section's position on the page
 * already says what it is. Only the landing screen keeps a label, because
 * nothing above it provides that context.
 *
 * Every section is at least a full viewport and centres its own content, so
 * each one arrives as a complete screen rather than a fragment with the next
 * section already pushing in from below. Sections whose content runs taller
 * than the viewport simply grow past it.
 *
 * A jump lands the heading just under the header rather than a screen below it.
 * The maths: the landing point is scroll-padding (0.5rem) plus this margin, and
 * the heading sits one section-padding below that -- 64px at this size, 80px
 * from md. So mobile needs no pull and md needs -2rem, both leaving the heading
 * clear of the header.
 */
const Section = ({ id, title, intro, children, wide = false, tight = false }) => {
  return (
    <section
      id={id}
      className={`mx-auto flex min-h-[100dvh] flex-col justify-center px-6 py-16 md:py-20 md:-scroll-mt-8 ${
        wide ? "max-w-7xl" : "max-w-6xl"
      }`}
    >
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="max-w-3xl"
      >
        {/* Display scale: Geist carries a tighter track than Inter did, and the
            heading is the only thing holding the section's hierarchy now that
            the label is gone, so it runs a step larger than before. */}
        <h2 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-fg md:text-[2.75rem]">
          {title}
        </h2>

        {intro && (
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-muted">
            {intro}
          </p>
        )}
      </motion.header>

      <div className={tight ? "mt-6" : "mt-10 md:mt-12"}>{children}</div>
    </section>
  );
};

export default Section;
