// src/components/Hero.jsx
import React from "react";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-900">
      <h1 className="text-5xl font-bold mb-4">Hi, I'm [Your Name]</h1>
      <p className="text-xl text-gray-400 mb-6">
        Aspiring Full Stack Developer | Student on OJT
      </p>
      <a
        href="#contact"
        className="px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition"
      >
        Contact Me
      </a>
    </section>
  );
};

export default Hero;
