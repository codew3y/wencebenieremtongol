import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div
          className="text-2xl font-bold cursor-pointer text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          WENCE
        </div>

        <ul className="hidden md:flex space-x-6 text-gray-200">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="hover:text-cyan-400 transition"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <FiX size={28} className="text-white" /> : <FiMenu size={28} className="text-white" />}
          </button>
        </div>
      </div>

      {open && (
        <ul className="flex flex-col items-center bg-gray-800 md:hidden">
          {links.map((link) => (
            <li key={link.name} className="py-4">
              <a
                href={link.href}
                className="hover:text-cyan-400 transition"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
