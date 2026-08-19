import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import profilePhoto from "../assets/img/profile-photo.JPG";
import ResumeModal from "./ResumeModal";
import useTypewriter from "../hooks/useTypewriter";
import { fadeIn, stagger } from "../lib/motion";

// The card fades in first, then its rows print, then the prompt types. Kept
// tight on purpose: this is decoration, and nobody should wait on it to read.
const ROWS_START = 0.45;
const ROW_STAGGER = 0.075;
const PROMPT = "automation · integration · cloud";
const PROMPT_DELAY = 850;

const meta = [
  // Kept short so each value fits the narrowed card on one line.
  { key: "role", value: "CRM Developer" },
  { key: "focus", value: "Integrations & Automation" },
  { key: "stack", value: "Deluge · Node.js · Azure" },
  { key: "school", value: "Pampanga State University" },
  { key: "location", value: "Pampanga, Philippines" },
];

const socials = [
  { icon: <FaGithub />, href: "https://github.com/codew3y/", label: "GitHub" },
  {
    icon: <FaLinkedinIn />,
    href: "https://www.linkedin.com/in/wence-tongol-32a968393/",
    label: "LinkedIn",
  },
  {
    icon: <HiOutlineMail />,
    href: "mailto:tongolwey@gmail.com",
    label: "Email",
  },
];

const Hero = () => {
  const [resumeOpen, setResumeOpen] = useState(false);
  const { typed, done } = useTypewriter(PROMPT, {
    speed: 18,
    startDelay: PROMPT_DELAY,
  });

  return (
    <section
      id="home"
      className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-28 pb-20"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-accent">
            crm developer &amp; integrations specialist
          </p>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-fg sm:text-5xl md:text-6xl">
            Wence Benierem
            <br />
            Tongol
          </h1>

          <p className="mt-6 max-w-xl leading-relaxed text-muted">
            I automate business processes and connect enterprise systems — Zoho
            CRM automation in Deluge, MCP connectors on Microsoft Azure, and
            REST integrations secured with OAuth 2.0. I use Claude throughout
            the development workflow, from drafting and debugging code to
            documentation and integration troubleshooting.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90"
            >
              Get in touch
            </a>
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-2.5 font-semibold text-fg transition-colors hover:border-accent/60 hover:text-accent"
            >
              Résumé <FiFileText size={16} />
            </button>

            <div className="ml-1 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={
                    social.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/5 lg:ml-auto"
        >
          <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-2 font-mono text-xs text-faint">~/whoami</span>
          </div>

          <div className="p-5">
            {/* Centred because it sits alone in the card. Source is 397x595, so
                248px is a ~25% upscale at 2x DPR — a higher-resolution original
                would let this grow further. The aspect ratio matches the file,
                so nothing is cropped. */}
            <img
              src={profilePhoto}
              alt="Wence Benierem Tongol"
              width="397"
              height="595"
              className="mx-auto w-full max-w-[248px] rounded-xl border border-line object-cover"
              style={{ aspectRatio: "397 / 595" }}
            />

            {/* Printed line by line, the way command output actually arrives. */}
            <motion.dl
              variants={stagger(ROW_STAGGER, ROWS_START)}
              initial="hidden"
              animate="show"
              className="mt-6 space-y-2.5 font-mono text-xs"
            >
              {meta.map((item) => (
                <motion.div
                  key={item.key}
                  variants={fadeIn}
                  className="flex gap-2"
                >
                  {/* Wide enough for "location" (8 chars) so every value aligns. */}
                  <dt className="w-16 shrink-0 text-accent">{item.key}</dt>
                  <dd className="text-muted">{item.value}</dd>
                </motion.div>
              ))}
            </motion.dl>

            <p
              aria-hidden="true"
              className="mt-6 min-h-[1.5em] font-mono text-[11px] text-faint"
            >
              <span className="text-accent">$</span> {typed}
              <span
                className={`ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-accent ${
                  done ? "motion-safe:animate-pulse" : ""
                }`}
              />
            </p>
          </div>
        </motion.div>
      </div>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
};

export default Hero;
