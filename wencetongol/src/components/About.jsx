import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-20 max-w-4xl mx-auto text-center px-4">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-6 text-white"
      >
        About Me
      </motion.h2>
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-gray-400 text-lg"
      >
        I'm a student currently doing OJT, passionate about building web applications. I aspire to become a Full Stack Developer and create user-friendly, modern web experiences.
      </motion.p>
    </section>
  );
};

export default About;
