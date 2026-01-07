import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-800 text-center px-4">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-12 text-white"
      >
        Get in Touch
      </motion.h2>

      <motion.form
        action = "https://formspree.io/f/xvzgeavj"
        method="POST"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto flex flex-col gap-4 text-left"
      >
        <label className="text-gray-300 font-medium">
          Name
          <input type="text" name="name" placeholder="Your Name" className="w-full mt-2 px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-cyan-400 focus:outline-none"/>
        </label>

        <label className="text-gray-300 font-medium">
          Email
          <input type="email" name="email" placeholder="youremail@example.com" className="w-full mt-2 px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-cyan-400 focus:outline-none"/>
        </label>

        <label className="text-gray-300 font-medium">
          Subject
          <input type="text" name="subject" placeholder="Subject" className="w-full mt-2 px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-cyan-400 focus:outline-none"/>
        </label>

        <label className="text-gray-300 font-medium">
          Message
          <textarea name="message" rows="5" placeholder="Your Message" className="w-full mt-2 px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-cyan-400 focus:outline-none resize-none"/>
        </label>

        <button type="submit" className="mt-4 px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
          Send a Message
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex justify-center mt-12 gap-6"
      >
        <a href="https://www.facebook.com/share/1AKQEk1AEq/?mibextid=wwXIfr/" target="_blank" rel="noopener noreferrer" className="p-5 bg-gray-700 rounded-lg hover:bg-cyan-500 text-white text-3xl transition flex items-center justify-center">
          <FaFacebookF />
        </a>

        <a href="https://www.linkedin.com/in/wey-tongol-32a968393/" target="_blank" rel="noopener noreferrer" className="p-5 bg-gray-700 rounded-lg hover:bg-cyan-500 text-white text-3xl transition flex items-center justify-center">
          <FaLinkedinIn />
        </a>

        <a href="https://github.com/codew3y/" target="_blank" rel="noopener noreferrer" className="p-5 bg-gray-700 rounded-lg hover:bg-cyan-500 text-white text-3xl transition flex items-center justify-center">
          <FaGithub />
        </a>
      </motion.div>
    </section>
  );
};

export default Contact;
