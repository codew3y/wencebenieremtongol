import React from "react";
import { motion } from "framer-motion";
import { 
  SiHtml5, SiCss3, SiJavascript, SiReact, SiTailwindcss, SiBootstrap,
  SiPhp, SiMysql, SiMongodb, SiNodedotjs,
  SiGit, SiGithub, SiDiscord, SiTrello
} from "react-icons/si";

const skillIcons = {
  HTML: <SiHtml5 className="inline-block mr-2" />,
  CSS: <SiCss3 className="inline-block mr-2" />,
  JavaScript: <SiJavascript className="inline-block mr-2" />,
  React: <SiReact className="inline-block mr-2" />,
  "Tailwind CSS": <SiTailwindcss className="inline-block mr-2" />,
  Bootstrap: <SiBootstrap className="inline-block mr-2" />,
  PHP: <SiPhp className="inline-block mr-2" />,
  MySQL: <SiMysql className="inline-block mr-2" />,
  MongoDB: <SiMongodb className="inline-block mr-2" />,
  "Node.js": <SiNodedotjs className="inline-block mr-2" />,
  Git: <SiGit className="inline-block mr-2" />,
  GitHub: <SiGithub className="inline-block mr-2" />,
  Discord: <SiDiscord className="inline-block mr-2" />,
  Trello: <SiTrello className="inline-block mr-2" />,
};

const skills = {
  "Frontend Development": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Bootstrap"],
  "Backend Development": ["PHP", "MySQL", "MongoDB", "Node.js"],
  Others: ["Git", "GitHub", "Discord", "Trello"],
};

const Skills = () => {
  return (
    <section id="skills" className="py-24 px-6 bg-gray-900 text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Tech Stack</h2>
        <p className="max-w-3xl mx-auto text-gray-400 leading-relaxed">
          These are the technologies I’ve worked with throughout my journey as a web developer.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-16">
        {Object.entries(skills).map(([category, items], idx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-white">{category}</h3>
            <div className="h-px w-full bg-white/10 mb-8" />

            <div className="flex flex-wrap gap-4">
              {items.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="px-6 py-3 border border-white/20 rounded-md text-sm text-gray-200 bg-white/5 backdrop-blur-sm hover:border-cyan-400/60 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all flex items-center"
                >
                  {skillIcons[skill]} {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
