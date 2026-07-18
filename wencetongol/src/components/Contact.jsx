import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";

const details = [
  { icon: <HiOutlineMail />, label: "tongolwey@gmail.com", href: "mailto:tongolwey@gmail.com" },
  { icon: <HiOutlinePhone />, label: "0930 751 9702", href: "tel:+639307519702" },
  { icon: <FiMapPin />, label: "Minalin, Pampanga", href: null },
];

const socials = [
  { icon: <FaGithub />, href: "https://github.com/codew3y/" },
  { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/in/wey-tongol-32a968393/" },
  { icon: <FaFacebookF />, href: "https://www.facebook.com/share/1AKQEk1AEq/?mibextid=wwXIfr/" },
];

const Contact = () => {
  return (
    <section id="contact" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-2">
          Contact
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get in touch
        </h2>
        <p className="text-gray-400 max-w-2xl mb-10">
          Have a question or an opportunity? Send a message and I'll get back to you.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-10">
        <div className="space-y-4">
          {details.map((d) => {
            const content = (
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-cyan-400 text-lg">{d.icon}</span>
                <span className="text-sm">{d.label}</span>
              </div>
            );
            return d.href ? (
              <a key={d.label} href={d.href} className="block hover:text-cyan-400 transition-colors">
                {content}
              </a>
            ) : (
              <div key={d.label}>{content}</div>
            );
          })}

          <div className="flex gap-3 pt-2">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <form
          action="https://formspree.io/f/xvzgeavj"
          method="POST"
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              className="px-4 py-2.5 rounded-lg bg-white/5 text-gray-200 border border-white/10 focus:border-cyan-400 focus:outline-none placeholder-gray-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="px-4 py-2.5 rounded-lg bg-white/5 text-gray-200 border border-white/10 focus:border-cyan-400 focus:outline-none placeholder-gray-500"
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="px-4 py-2.5 rounded-lg bg-white/5 text-gray-200 border border-white/10 focus:border-cyan-400 focus:outline-none placeholder-gray-500"
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your message"
            required
            className="px-4 py-2.5 rounded-lg bg-white/5 text-gray-200 border border-white/10 focus:border-cyan-400 focus:outline-none placeholder-gray-500 resize-none"
          />
          <button
            type="submit"
            className="self-start px-6 py-2.5 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
