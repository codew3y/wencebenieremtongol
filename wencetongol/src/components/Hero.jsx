import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { SiClaude, SiNodedotjs, SiPython, SiReact, SiZoho } from "react-icons/si";
import {
  TbBrandAzure,
  TbBrandOauth,
  TbPlugConnected,
  TbTopologyStar3,
} from "react-icons/tb";
import profilePhoto from "../assets/img/profile-photo.JPG";
import ResumeModal from "./ResumeModal";
import useTypewriter from "../hooks/useTypewriter";
import { fadeIn, stagger } from "../lib/motion";

// The card lands first, then its detail rows print, then the prompt types.
// Kept tight on purpose: this is decoration, and nobody should wait on it.
const ROWS_START = 0.45;
const ROW_STAGGER = 0.075;
const PROMPT = "automation · integration · cloud";
const PROMPT_DELAY = 850;

// Cover: the stack itself, drawn from the same icon set the skills section
// uses. It answers "what does he work with" before anyone scrolls, which is
// more than a decorative band usually earns.
const STACK = [
  { Icon: SiZoho, label: "Zoho" },
  { Icon: TbBrandAzure, label: "Microsoft Azure" },
  { Icon: SiNodedotjs, label: "Node.js" },
  { Icon: TbBrandOauth, label: "OAuth 2.0" },
  { Icon: TbPlugConnected, label: "Model Context Protocol" },
  { Icon: SiPython, label: "Python" },
  { Icon: TbTopologyStar3, label: "REST integration" },
  { Icon: SiReact, label: "React" },
  { Icon: SiClaude, label: "Claude" },
];

const meta = [
  // Kept short so each value fits its column on one line.
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
      {/* Profile-card layout: cover band, avatar breaking its lower edge, then
          the identity block and pill actions -- the arrangement a visitor
          already knows from every professional profile they have read. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/5"
      >
        {/* The cover: the stack, as logos. It answers "what does he work
            with" before anyone scrolls, which is more than a decorative band
            usually earns. */}
        <div className="relative h-28 overflow-hidden border-b border-line bg-canvas-2 sm:h-40">
          {/* The band has to be opaque. --surface-2 is white at 7% in dark
              mode, so the page's fixed blueprint backdrop was showing straight
              through it -- the "lines inside the cover". canvas-2 is solid in
              both themes; the tint goes on top of it. */}
          <div className="absolute inset-0 bg-surface-2" />
          {/* Static on purpose: this sits directly above the name, and a
              moving band competes with reading it. */}
          <ul className="absolute inset-0 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 sm:gap-x-12 md:px-10">
            {STACK.map(({ Icon, label }) => (
              <li key={label} className="text-faint/70" title={label}>
                <Icon size={28} aria-hidden="true" className="sm:h-10 sm:w-10" />
                <span className="sr-only">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-8 md:px-8">
          {/* The negative margin lifts the avatar over the band, and the ring
              cuts it out of the cover the way a profile photo always is. */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            {/* relative z-10: the cover band is positioned, so it paints in a
                later layer than static content and was clipping the top of the
                head. This puts the avatar in that layer, after it. */}
            {/* The head sits between 28% and 59% of the frame, so object-top
                was leaving a third of the circle as empty backdrop above it.
                Framed on the face instead, and scaled in so the head fills the
                circle rather than floating in it.

                The nudge left is a translate, not object-position: the source is
                a portrait in a square box, so object-cover crops vertically only
                and has no horizontal slack to pan into. The slack comes from the
                scale, and a percentage keeps the nudge proportional at both
                avatar sizes. */}
            <div className="relative z-10 -mt-14 h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-surface sm:-mt-20 sm:h-36 sm:w-36">
              <img
                src={profilePhoto}
                alt="Wence Benierem Tongol"
                width="397"
                height="595"
                className="h-full w-full -translate-x[4%] scale-[1.10] object-cover object-[50%_50%]"
              />
            </div>

            {/* Sits where a profile header carries the company row, so it
                needs the same chip treatment -- as bare text it floated in the
                gap between the cover and the name. */}
            <p
              aria-hidden="true"
              className="mb-1 flex min-w-0 items-center gap-2 rounded-full border border-line bg-canvas-2 px-3.5 py-1.5 font-mono text-[11px] text-faint sm:text-xs"
            >
              <span className="text-accent">$</span>
              <span className="truncate">{typed}</span>
              <span
                className={`inline-block h-3 w-1.5 shrink-0 translate-y-px bg-accent ${
                  done ? "motion-safe:animate-pulse" : ""
                }`}
              />
            </p>
          </div>

          <div className="mt-5">
            <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-5xl">
              Wence Benierem Tongol
            </h1>

            {/* The headline slot: what the eyebrow said, in the place a profile
                puts the line that tells you what someone does. */}
            <p className="mt-2 font-mono text-sm text-accent">
              crm developer &amp; integrations specialist
            </p>

            <p className="mt-1.5 text-sm text-muted">
              Pampanga, Philippines ·{" "}
              <a href="#contact" className="text-accent hover:underline">
                Contact info
              </a>
            </p>
          </div>

          <p className="mt-5 max-w-3xl leading-relaxed text-muted">
            I automate business processes and connect enterprise systems — Zoho
            CRM automation in Deluge, MCP connectors on Microsoft Azure, and
            REST integrations secured with OAuth 2.0. I use Claude throughout
            the development workflow, from drafting and debugging code to
            documentation and integration troubleshooting.
          </p>

          {/* Pill actions, the primary one filled, in the profile header's own
              order: act, then read, then find me elsewhere. */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-accent px-6 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90"
            >
              Get in touch
            </a>
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-2.5 font-semibold text-fg transition-colors hover:border-accent/60 hover:text-accent"
            >
              Résumé <FiFileText size={16} />
            </button>

            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={
                    social.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* The whoami rows, kept as the card's detail strip. */}
          <motion.dl
            variants={stagger(ROW_STAGGER, ROWS_START)}
            initial="hidden"
            animate="show"
            className="mt-8 grid gap-x-8 gap-y-2.5 border-t border-line pt-6 font-mono text-xs sm:grid-cols-2 lg:grid-cols-3"
          >
            {meta.map((item) => (
              <motion.div
                key={item.key}
                variants={fadeIn}
                className="flex min-w-0 gap-2"
              >
                {/* Wide enough for "location" (8 chars) so every value aligns. */}
                <dt className="w-16 shrink-0 text-accent">{item.key}</dt>
                <dd className="min-w-0 truncate text-muted">{item.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
};

export default Hero;
