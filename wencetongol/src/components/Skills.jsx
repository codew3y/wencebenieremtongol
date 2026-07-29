import React from "react";
import { motion } from "framer-motion";

const groups = {
  "Frontend": ["HTML", "CSS", "JavaScript", "ReactJS", "Tailwind CSS"],
  "Backend & Automation": ["PHP", "NodeJS", "Zoho Deluge", "C#"],
  "Databases & Tools": [
    "MySQL",
    "MongoDB",
    "Zoho CRM",
    "Zoho Writer",
    "Postman",
    "PowerShell",
    "EcoHub",
  ],
  "AI Tools": ["Claude", "Claude Code", "Claude Cowork"],
  "Core Strengths": [
    "Problem Solving",
    "Troubleshooting",
    "Leadership",
    "Documentation",
    "Team Collaboration",
  ],
};

const Skills = () => {
  return (
    <section id="skills" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-2">
          Skills
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Technical stack
        </h2>
      </motion.div>

      <div className="space-y-8">
        {Object.entries(groups).map(([title, items], idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-8"
          >
            <h3 className="text-base font-semibold text-gray-200">{title}</h3>
            <div className="flex flex-wrap gap-2.5">
              {items.map((item) => (
                <span
                  key={item}
                  className="px-3.5 py-1.5 text-sm rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-400 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
