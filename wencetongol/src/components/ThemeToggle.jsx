import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";

const STORAGE_KEY = "theme";

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage can throw in private/blocked contexts — fall through to system.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const ThemeToggle = ({ className = "" }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  // Keep following the OS until the visitor picks a side themselves.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        // Unreadable storage means no explicit choice was ever saved.
      }
      setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Preference just won't persist; the toggle still works this session.
      }
      return next;
    });
  }, []);

  const isDark = theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} theme`;

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent ${className}`}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ y: 12, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="grid place-items-center"
        >
          {isDark ? <FiMoon size={16} /> : <FiSun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
