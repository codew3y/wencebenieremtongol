import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { fadeUp, stagger, viewportOnce } from "../lib/motion";

const groups = [
  {
    title: "Languages",
    items: [
      "JavaScript",
      "Node.js",
      "Python",
      "PHP",
      "C#",
      "Zoho Deluge",
      "HTML",
      "CSS",
      "SQL",
    ],
  },
  { title: "Frontend", items: ["ReactJS", "Tailwind CSS"] },
  {
    title: "Cloud & Identity",
    items: ["Microsoft Azure", "OAuth 2.0", "JSON Web Tokens (JWT)"],
  },
  {
    title: "Platforms & APIs",
    items: [
      "Zoho CRM",
      "Zoho Writer",
      "Zoho Flow",
      "Microsoft Graph",
      "Microsoft Purview eDiscovery",
      "Model Context Protocol",
    ],
  },
  { title: "Databases", items: ["MySQL", "MongoDB"] },
  {
    title: "Testing & Tooling",
    items: [
      "Postman",
      "PowerShell",
      "EcoHub",
      "Git",
      "GitHub Actions",
      "Node.js test runner",
      "pytest",
    ],
  },
  {
    title: "Practices",
    items: [
      "REST integration",
      "Automated testing",
      "CI/CD",
      "Audit logging",
      "Technical writing",
      "Incident troubleshooting",
    ],
  },
  {
    title: "AI Tooling",
    items: ["Claude", "Claude Code", "Claude Cowork"],
  },
  {
    title: "Strengths",
    items: [
      "Analytical problem solving",
      "Ownership",
      "Collaboration",
      "Clear written communication",
    ],
  },
];

const Skills = () => {
  return (
    <Section
      id="skills"
      index="02"
      label="skills"
      title="Technical stack"
      intro="The languages, platforms, and practices I work with day to day."
    >
      <motion.div
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="divide-y divide-line border-y border-line"
      >
        {groups.map((group) => (
          <motion.div
            key={group.title}
            variants={fadeUp}
            className="grid gap-3 py-5 md:grid-cols-[200px_1fr] md:gap-8"
          >
            <h3 className="font-mono text-sm text-accent">{group.title}</h3>
            {/* Chips cascade within their row once the row itself arrives. */}
            <motion.div
              variants={stagger(0.02)}
              className="flex flex-wrap gap-2"
            >
              {group.items.map((item) => (
                <motion.span
                  key={item}
                  variants={fadeUp}
                  className="rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-[13px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Skills;
