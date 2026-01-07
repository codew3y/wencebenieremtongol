import React from "react";
import { motion } from "framer-motion";
import { SiReact, SiTailwindcss, SiNodedotjs } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import Project1 from "../assets/img/projectsimg/portfolio-bg.png";

const projects = [
  {
    name: "Portfolio Website",
    link: "https://github.com/codew3y/portfolio",
    tech: ["React", "Tailwind CSS"],
    github: "https://github.com/codew3y/wencebenieremtongol",
    desc: "A personal portfolio website built with React and Tailwind CSS.",
    image: Project1,
  },
  {
    name: "Task Manager",
    link: "https://github.com/codew3y/task-manager",
    tech: ["React", "Tailwind CSS", "Node.js"],
    github: "https://github.com/codew3y/wencebenieremtongol",
    desc: "Full-stack task manager app using React, Tailwind CSS, and Node.js.",
    image: Project1,
  },
];

const techIcons = {
  "React": <SiReact className="inline-block mr-1" />,
  "Tailwind CSS": <SiTailwindcss className="inline-block mr-1" />,
  "Node.js": <SiNodedotjs className="inline-block mr-1" />,
};

const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 bg-gray-900 text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Projects
        </h2>
        <p className="max-w-3xl mx-auto text-gray-400 leading-relaxed">
          These are some of the projects I’ve built using modern web technologies.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="border border-white/20 rounded-md overflow-hidden bg-white/5 backdrop-blur-sm hover:border-cyan-400/60 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all flex flex-col h-full"
          >
            {/* Project Image */}
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-48 object-cover"
            />

            {/* Card Content */}
            <div className="p-4 flex flex-col gap-3 flex-1 bg-white/5">
              <h3 className="text-2xl font-bold text-white">{project.name}</h3>
              <p className="text-gray-200 text-sm">{project.desc}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 text-sm">
                {project.tech.map((tech) => (
                  <div
                    key={tech}
                    className="px-2 py-1 border border-white/20 rounded-md bg-white/10 backdrop-blur-sm flex items-center gap-1 text-white text-xs"
                  >
                    {techIcons[tech] || null} {tech}
                  </div>
                ))}
              </div>

              {/* View Project Button */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-md bg-white/10 backdrop-blur-sm hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all font-semibold justify-center mt-auto"
              >
                <FaGithub /> View Project
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
