import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const links = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-950/80 backdrop-blur border-b border-white/5">
      <nav className="max-w-5xl mx-auto flex justify-between items-center px-6 h-16">
        <a
          href="#home"
          className="text-lg font-semibold tracking-tight text-white"
        >
          Wence<span className="text-cyan-400">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          {links.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="hover:text-cyan-400 transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <ul className="md:hidden flex flex-col px-6 pb-4 text-sm text-gray-300 bg-gray-950/95 border-b border-white/5">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Navbar;
