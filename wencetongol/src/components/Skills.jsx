import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";

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
      <div className="divide-y divide-line border-y border-line">
        {groups.map((group, idx) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: Math.min(idx, 5) * 0.06 }}
            className="grid gap-3 py-5 md:grid-cols-[200px_1fr] md:gap-8"
          >
            <h3 className="font-mono text-sm text-accent">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-[13px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
