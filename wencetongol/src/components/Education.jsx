import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";

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
  return (
    <Section
      id="education"
      index="05"
      label="education + certifications"
      title="Background"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {education.map((entry) => (
            <div
              key={entry.school}
              className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold text-fg">{entry.school}</h3>
                <span className="font-mono text-xs whitespace-nowrap text-faint">
                  {entry.period}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{entry.detail}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="divide-y divide-line rounded-xl border border-line bg-surface"
        >
          {certifications.map((group) => (
            <div key={group.issuer} className="p-5">
              <h3 className="font-mono text-sm text-accent">{group.issuer}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

export default Education;
