import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

const links = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section is currently under the header.
  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-72px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-canvas/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#home"
          className="font-mono text-sm font-semibold tracking-tight text-fg"
        >
          <span className="text-accent">&lt;</span>
          wence
          <span className="text-accent"> /&gt;</span>
        </a>

        <ul className="hidden items-center gap-7 font-mono text-[13px] text-muted md:flex">
          {links.map((link, idx) => (
            <li key={link.name}>
              <a
                href={link.href}
                aria-current={active === link.href ? "true" : undefined}
                className={`relative block pb-1 transition-colors hover:text-accent ${
                  active === link.href ? "text-accent" : ""
                }`}
              >
                <span className="text-faint">
                  {String(idx + 1).padStart(2, "0")}.
                </span>{" "}
                {link.name}
                {/* Shared layoutId lets the underline glide between links
                    instead of disappearing and reappearing. */}
                {active === link.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute bottom-0 left-0 h-px w-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-fg md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-b border-line bg-canvas/95 px-6 pb-4 font-mono text-sm text-muted backdrop-blur-md md:hidden">
          {links.map((link, idx) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 transition-colors hover:text-accent"
              >
                <span className="text-faint">
                  {String(idx + 1).padStart(2, "0")}.
                </span>{" "}
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
