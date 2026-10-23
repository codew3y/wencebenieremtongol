import React, { useState } from "react";
import { TbFileText, TbMail } from "react-icons/tb";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { motion } from "framer-motion";
import profilePhoto from "../assets/img/profile-photo.webp";
import ResumeModal from "./ResumeModal";
import Section from "./Section";
import { fadeIn, stagger } from "../lib/motion";

// The profile card used to be the landing screen. It belongs here: the landing
// says what the work is, this section says who does it.

const ROWS_START = 0.45;
const ROW_STAGGER = 0.075;

// The card's detail strip. Company and languages moved in here when the
// separate facts panel went: it listed the same things twice, one of them a
// column away from the other.
const meta = [
  { key: "also known as", value: "Weywey" },
  { key: "current role", value: "CRM Developer Associate" },
  { key: "company", value: "Manentia Enterprise Support PH Inc." },
  { key: "focus", value: "Full-stack development & automation" },
  { key: "stack", value: "Deluge · Node.js · Azure" },
  { key: "school", value: "Pampanga State University" },
  { key: "location", value: "Pampanga, Philippines" },
  { key: "languages", value: "Filipino (native), English (professional)" },
];

const socials = [
  { icon: <SiGithub />, href: "https://github.com/codew3y/", label: "GitHub" },
  {
    icon: <SiLinkedin />,
    href: "https://www.linkedin.com/in/wence-tongol-32a968393/",
    label: "LinkedIn",
  },
  {
    icon: <TbMail />,
    href: "mailto:tongolwey@gmail.com",
    label: "Email",
  },
];

const About = () => {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <Section id="about" title="Who I am">
      {/* Two columns rather than a stacked profile card. The card ran the full
          width with the prose set to a third of it, so most of the section was
          empty to the right and it spilled past a screen. Identity on the left,
          what I actually do on the right.

          The teal cover band went with it: it was a 160px flat block whose only
          content was a row of stack icons, and the Stack section sits directly
          below repeating every one of them. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="grid gap-10 lg:grid-cols-[19rem_1fr] lg:gap-16"
      >
        {/* Identity. */}
        <aside className="lg:border-r lg:border-line lg:pr-12">
          {/* A rounded square, not a circle. Circular avatars are the default
              everywhere, and the squircle matches the page's corner scale. */}
          <div className="h-44 w-44 overflow-hidden rounded-2xl border border-line">
            <img
              src={profilePhoto}
              alt="Wence Benierem Tongol"
              width="397"
              height="595"
              className="h-full w-full object-cover object-[50%_18%]"
            />
          </div>

          <h2 className="mt-6 text-2xl leading-tight font-semibold tracking-[-0.02em] text-fg">
            Wence Benierem Tongol
          </h2>
          <p className="mt-2 font-mono text-sm text-accent">
            full-stack developer
          </p>
          <p className="mt-1.5 text-sm text-muted">
            Pampanga, Philippines ·{" "}
            <a href="#contact" className="text-accent hover:underline">
              Contact info
            </a>
          </p>

          <div className="mt-6 flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={
                  social.href.startsWith("mailto:") ? undefined : "_blank"
                }
                rel="noopener noreferrer"
                aria-label={social.label}
                className="pressable grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            className="pressable mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-accent/60 hover:text-accent"
          >
            Résumé <TbFileText size={15} />
          </button>
        </aside>

        {/* What the work actually is. */}
        <div>
          <p className="max-w-[65ch] text-[1.0625rem] leading-relaxed text-muted">
            I'm a full-stack developer working mainly in TypeScript. I build
            Next.js and React interfaces, the APIs that serve them, and the
            PostgreSQL databases behind both, as well as the integrations that
            connect applications to AI tools. I test as I build and document as
            I go, so the work can be handed over cleanly.
          </p>

          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-muted">
            In my current role that work is business automation: CRM workflows
            that turn records into finished client documents, MCP connectors
            that automate our daily work, and integrations that recover on their
            own when a connection drops. Mostly REST and OAuth 2.0 underneath,
            verified with Postman and PowerShell before it reaches production.
          </p>

          <motion.dl
            variants={stagger(ROW_STAGGER, ROWS_START)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 grid gap-x-10 gap-y-3 border-t border-line pt-8 font-mono text-xs sm:grid-cols-2"
          >
            {meta.map((item) => (
              <motion.div
                key={item.key}
                variants={fadeIn}
                className="flex min-w-0 gap-3"
              >
                {/* Wide enough for "languages" so every value aligns. */}
                <dt className="w-24 shrink-0 text-accent">{item.key}</dt>
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
