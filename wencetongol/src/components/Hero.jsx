import React from "react";
import { motion } from "framer-motion";
import profilePhoto from "../assets/img/profile-photo.JPG";
import CVResume from "../assets/CV/resume.pdf";


const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-900 px-4">
      <motion.img
  src={profilePhoto}
  alt="Profile Photo"
  className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-cyan-500 mb-6 shadow-lg object-cover"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
/>


      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-white"
      >
        Hi, I'm Wence Tongol
      </motion.h1>

      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-xl md:text-2xl text-gray-400 mb-6"
      >
        Aspiring Full Stack Developer | Student
      </motion.p>

      <div className="flex flex-col md:flex-row gap-4">
        <motion.a
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          href="#contact"
          className="px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition"
        >
          Contact Me
        </motion.a>

        <motion.a
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          href={CVResume}
          download
          className="px-6 py-3 border border-cyan-500 text-cyan-500 rounded-lg font-semibold hover:bg-cyan-500 hover:text-black transition"
        >
          Download Resume
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
