import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { fadeUp, stagger, viewportOnce } from "../lib/motion";
import useSpotlight from "../hooks/useSpotlight";

const education = [
  {
    school: "Pampanga State University",
    detail: "Bachelor of Science in Information Technology",
    period: "2022 – 2026",
  },
  {
    school: "Assumpta Technical High School",
    detail: "Junior & Senior High School",
    period: "2016 – 2022",
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
    items: ["Introduction to Internet of Things (IoT) and Digital Transformation"],
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
  const onSpotlight = useSpotlight();

  return (
    <Section
      id="education"
      index="05"
      label="education + certifications"
      title="Background"
    >
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-6 lg:grid-cols-2"
      >
        <motion.div variants={stagger(0.08)} className="space-y-4">
          {education.map((entry) => (
            <motion.div
              key={entry.school}
              variants={fadeUp}
              onPointerMove={onSpotlight}
              className="spotlight rounded-xl border border-line bg-surface p-5 transition-[transform,border-color] duration-200 hover:border-accent/40 motion-safe:hover:-translate-y-0.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                {/* Accent, matching the "Outside the code" and certification
                    headings so every card in the section leads the same way. */}
                <h3 className="font-semibold text-accent">{entry.school}</h3>
                <span className="font-mono text-xs whitespace-nowrap text-faint">
                  {entry.period}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{entry.detail}</p>
            </motion.div>
          ))}

          {/* Fills the height the two school cards leave against the taller
              certifications column, and says something the resume does not. */}
          <motion.div
            variants={fadeUp}
            onPointerMove={onSpotlight}
            className="spotlight rounded-xl border border-line bg-surface p-5 transition-[transform,border-color] duration-200 hover:border-accent/40 motion-safe:hover:-translate-y-0.5"
          >
            <h3 className="font-mono text-sm text-accent">Outside the code</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              When I'm not in the editor, I'm usually deep in a game or working
              through my watchlist — that's how I switch off after a day of
              chasing bugs. Whatever's left of my time belongs to family and
              friends. I care about shipping work I can stand behind, and just
              as much about knowing when to close the laptop.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger(0.08)}
          className="divide-y divide-line rounded-xl border border-line bg-surface"
        >
          {certifications.map((group) => (
            <motion.div key={group.issuer} variants={fadeUp} className="p-5">
              <h3 className="font-mono text-sm text-accent">{group.issuer}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Education;
