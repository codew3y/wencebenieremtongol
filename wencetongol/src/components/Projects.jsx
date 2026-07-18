import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const projects = [
  {
    name: "VistaVR — Capstone Project",
    tech: "Unity · C#",
    desc: "A mobile-based Virtual Reality eye-testing app for digital vision assessments — visual acuity, color blindness, and astigmatism tests, with voice recognition for hands-free interaction and result recording.",
    link: null,
  },
  {
    name: "Personal Portfolio Website",
    tech: "ReactJS · Tailwind CSS",
    desc: "A responsive, dark-themed portfolio showcasing my technical skills, projects, and professional background.",
    link: "https://wencebenieremtongol.vercel.app/",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-2">
          Projects
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Things I've built
        </h2>
      </motion.div>

      <ul className="divide-y divide-white/10 border-t border-white/10">
        {projects.map((p, idx) => (
          <motion.li
            key={p.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="py-6 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                  <span className="text-xs text-cyan-400 border border-cyan-400/30 rounded px-2 py-0.5">
                    {p.tech}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-2xl">
                  {p.desc}
                </p>
              </div>

              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${p.name}`}
                  className="shrink-0 mt-1 p-2 rounded-lg border border-white/10 text-gray-400 group-hover:text-cyan-400 group-hover:border-cyan-400/50 transition-colors"
                >
                  <FiArrowUpRight />
                </a>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default Projects;
