import React from "react";
import { motion } from "framer-motion";

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
  "Palo Alto Networks — Cybersecurity Fundamentals",
  "Palo Alto Networks — Network Security Fundamentals",
  "Palo Alto Networks — Cloud Security Fundamentals",
  "Palo Alto Networks — Security Operations Fundamentals",
  "Cisco — Intro to IoT and Digital Transformation",
  "Anthropic — Claude 101",
  "Anthropic — Claude Code 101",
  "Anthropic — Introduction to Claude Cowork",
  "Anthropic — AI Fluency: Frameworks & Foundation",
  "Anthropic — AI Capabilities and Limitations",
];

const Education = () => {
  return (
    <section id="education" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-2">
          Education & Certifications
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Background
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {education.map((e) => (
            <div
              key={e.school}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-white font-semibold">{e.school}</h3>
                <span className="text-xs text-gray-500 shrink-0">{e.period}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{e.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-semibold mb-3">Certifications</h3>
          <ul className="space-y-2">
            {certifications.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-gray-400">
                <span className="text-cyan-400 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Education;
