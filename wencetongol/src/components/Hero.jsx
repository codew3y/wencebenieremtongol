import React from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiArrowUpRight } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import profilePhoto from "../assets/img/profile-photo.JPG";
import CVResume from "../assets/CV/Wence_Tongol_Resume_ATS_v2.pdf";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6 pt-24 pb-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row md:items-center gap-10"
      >
        <img
          src={profilePhoto}
          alt="Wence Tongol"
          className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border border-white/10 shadow-lg"
        />

        <div>
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-4">
            <FiMapPin className="text-cyan-400" /> Minalin, Pampanga
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Wence Benierem Tongol
          </h1>
          <p className="mt-3 text-lg md:text-xl text-cyan-400 font-medium">
            CRM Developer
          </p>
          <p className="mt-4 max-w-xl text-gray-400 leading-relaxed">
            I build and maintain Zoho CRM automations, custom MCP connectors, and
            API integrations — focused on business-process automation, workflows,
            and clean technical documentation.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="px-5 py-2.5 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
            >
              Get in touch
            </a>
            <a
              href={CVResume}
              download
              className="px-5 py-2.5 border border-white/15 text-gray-200 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
            >
              Résumé <FiArrowUpRight />
            </a>

            <div className="flex items-center gap-2 ml-1">
              <a
                href="https://github.com/codew3y/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-lg border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/wey-tongol-32a968393/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-lg border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="mailto:tongolwey@gmail.com"
                aria-label="Email"
                className="p-2.5 rounded-lg border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
              >
                <HiOutlineMail />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
