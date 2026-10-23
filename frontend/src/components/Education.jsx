import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { fadeUp, stagger, viewportOnce } from "../lib/motion";

const education = [
  {
    school: "Pampanga State University",
    detail: "Bachelor of Science in Information Technology",
    period: "2022 - 2026",
  },
  {
    school: "Assumpta Technical High School",
    detail: "Junior & Senior High School",
    period: "2016 - 2022",
  },
];

const certifications = [
  {
    issuer: "Palo Alto Networks",
    items: [
      "Cybersecurity Fundamentals",
      "Network Security Fundamentals",
      "Cloud Security Fundamentals",
      "Security Operations Fundamentals",
    ],
  },
  {
    issuer: "Cisco Networking Academy",
    items: [
      "Introduction to Internet of Things (IoT) and Digital Transformation",
    ],
  },
  {
    issuer: "Anthropic",
    items: [
      "Claude 101",
      "Claude Code 101",
      "Introduction to Claude Cowork",
      "AI Fluency: Frameworks & Foundation",
      "AI Capabilities and Limitations",
    ],
  },
];

const Education = () => {
  return (
    <Section id="education" title="Background" tight>
      {/* Three bands, all grouped the same way: a hairline, then the content
          under it. No boxes. The certifications used to sit in three bordered
          cards while the schools either side of them were plain, which made one
          band in the middle look like it belonged to a different page. */}
      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="space-y-9"
      >
        {/* Schools. */}
        <motion.div variants={stagger(0.06)} className="grid gap-6 sm:grid-cols-2">
          {education.map((entry) => (
            <motion.article
              key={entry.school}
              variants={fadeUp}
              className="border-t border-line pt-4 sm:pr-8"
            >
              <p className="font-mono text-xs text-faint">{entry.period}</p>
              <h3 className="mt-2 text-lg leading-tight font-semibold tracking-[-0.01em] text-fg">
                {entry.school}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {entry.detail}
              </p>
            </motion.article>
          ))}
        </motion.div>

        {/* Certifications: one column per issuer, no container. */}
        <motion.div variants={stagger(0.06)} className="grid gap-6 md:grid-cols-3">
          {certifications.map((group) => (
            <motion.div
              key={group.issuer}
              variants={fadeUp}
              className="border-t border-line pt-4 md:pr-6"
            >
              <h3 className="font-mono text-sm text-accent">{group.issuer}</h3>
              {/* No bullet dots. A coloured dot in front of every row is
                  decoration the list does not need; leading separates these
                  perfectly well on its own. */}
              <ul className="mt-3 space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="text-sm leading-snug text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* The personal note, on the full measure. */}
        <motion.div variants={fadeUp} className="border-t border-line pt-4">
          <h3 className="font-mono text-sm text-accent">Outside the code</h3>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-muted">
            When I'm not in the editor, I'm usually deep in a game or working
            through my watchlist. That's how I switch off after a day of chasing
            bugs. Whatever's left of my time belongs to family and friends. I
            care about shipping work I can stand behind, and just as much about
            knowing when to close the laptop.
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Education;
