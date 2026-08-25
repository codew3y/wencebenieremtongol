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
import Section from "./Section";
import { fadeIn, stagger } from "../lib/motion";

// The profile card used to be the landing screen. It belongs here: the landing
// says what the work is, this section says who does it.

const ROWS_START = 0.45;
const ROW_STAGGER = 0.075;

// The cover, drawn from the same icon set the skills section uses.
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

// The card's detail strip. Company and languages moved in here when the
// separate facts panel went: it listed the same things twice, one of them a
// column away from the other.
const meta = [
  { key: "role", value: "CRM Developer Associate" },
  { key: "company", value: "Manentia Enterprise Support PH Inc." },
  { key: "focus", value: "Integrations & Automation" },
  { key: "stack", value: "Deluge · Node.js · Azure" },
  { key: "school", value: "Pampanga State University" },
  { key: "location", value: "Pampanga, Philippines" },
  { key: "languages", value: "Filipino (native), English (professional)" },
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


const About = () => {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <Section id="about" label="about" title="Who I am">
      {/* Profile-card layout: cover band, avatar breaking its lower edge, then
          the identity block and pill actions -- the arrangement a visitor
          already knows from every professional profile they have read. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/5"
      >
        {/* A flat deep teal, the same in both themes: this band reads as
            cover art rather than surface, so it should not invert with the
            palette. It also has to be opaque -- a translucent fill let the
            page's fixed blueprint backdrop show straight through. Darker than
            --accent, but not so dark that the black marks below stop reading:
            black sits at about 3:1 on this, and drops under 2.5:1 by the time
            you reach teal-900. */}
        <div className="relative h-28 overflow-hidden border-b border-line bg-[#0b6173] sm:h-40">
          {/* Static on purpose: this sits directly above the name, and a moving
              band competes with reading it. */}
          <ul className="absolute inset-0 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 sm:gap-x-12 md:px-10">
            {STACK.map(({ Icon, label }) => (
              <li key={label} className="text-black" title={label}>
                <Icon size={28} aria-hidden="true" className="sm:h-10 sm:w-10" />
                <span className="sr-only">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-8 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            {/* relative z-10: the cover band is positioned, so it paints in a
                later layer than static content and was clipping the top of the
                head. This puts the avatar in that layer, after it.

                The nudge left is a translate, not object-position: the source is
                a portrait in a square box, so object-cover crops vertically only
                and has no horizontal slack to pan into. The slack comes from the
                scale, and a percentage keeps it proportional at both sizes. */}
            <div className="relative z-10 -mt-14 h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-surface sm:-mt-20 sm:h-36 sm:w-36">
              <img
                src={profilePhoto}
                alt="Wence Benierem Tongol"
                width="397"
                height="595"
                className="h-full w-full -translate-x-[2%] scale-[1.16] object-cover object-[50%_52%]"
              />
            </div>

            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="mb-1 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-accent/60 hover:text-accent"
            >
              Résumé <FiFileText size={15} />
            </button>
          </div>

          <div className="mt-5">
            <h3 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              Wence Benierem Tongol
            </h3>

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

          {/* The long-form about, condensed and moved inside the card. Three
              paragraphs beside a facts panel said the same things twice; this
              keeps the substance and leaves the section clean. */}
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
            I build the automation that sits between business systems: CRM
            workflows that turn records into finished client documents,
            connectors that let AI assistants reach enterprise data under
            per-user identity and audit control, and order routing that has to
            survive a dropped session mid-trade. Underneath it is mostly REST
            and OAuth 2.0, verified with Postman and PowerShell before it
            reaches production. I care about least-privilege scopes, audit
            logging, and documentation someone else can actually follow.
          </p>

          <div className="mt-6 flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* The whoami rows, kept as the card's detail strip. */}
          <motion.dl
            variants={stagger(ROW_STAGGER, ROWS_START)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-8 grid gap-x-8 gap-y-2.5 border-t border-line pt-6 font-mono text-xs sm:grid-cols-2 lg:grid-cols-3"
          >
            {meta.map((item) => (
              <motion.div
                key={item.key}
                variants={fadeIn}
                className="flex min-w-0 gap-2"
              >
                {/* Wide enough for "languages" so every value aligns. */}
                <dt className="w-20 shrink-0 text-accent">{item.key}</dt>
                <dd className="min-w-0 text-muted">{item.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </Section>
  );
};

export default About;
