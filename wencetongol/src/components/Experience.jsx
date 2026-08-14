import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import Section from "./Section";
import { fadeUp, stagger, viewportOnce } from "../lib/motion";
import useSpotlight from "../hooks/useSpotlight";

const roles = [
  {
    title: "CRM Developer Associate",
    company: "Manentia Enterprise Support PH Inc.",
    period: "Jun 2026 – Present",
    points: [
      "Automate Zoho CRM processes using Deluge scripting and Zoho Writer templates that generate client reports and investment proposals.",
      "Deliver custom MCP connectors on Azure App Service, exposing enterprise systems to AI assistants under per-user identity and audit control.",
      "Integrate Microsoft Graph email search and Microsoft Purview eDiscovery through app-only OAuth 2.0, applying least-privilege scopes and audit logging.",
      "Engineer a FIX 4.4 order-routing service in Python against a private bank's Rules of Engagement, covering mutual-TLS transport, session recovery, engine evaluation (QuickFIX/J against quickfix), and an end-to-end simulator test suite.",
      "Verify REST integrations with Postman, PowerShell, and EcoHub, exercising token handling, payload structure, and failure paths.",
      "Resolve assigned IT helpdesk tickets alongside development work.",
    ],
  },
  {
    title: "Information Technology Intern (On-the-Job Training)",
    company: "Manentia Enterprise Support PH Inc.",
    period: "Feb 2026 – May 2026",
    points: [
      "Produced and revised Zoho Writer templates driving Financial Planning Report (FPR) and investment proposal generation.",
      "Wrote Deluge functions that mapped CRM records into finished report and proposal documents.",
      "Extended proposal automation across six investment providers, each with its own template and business logic.",
      "Diagnosed Zoho Writer rendering faults — chart configuration limits, page breaks, and blank pages — through iterative testing.",
      "Assisted API integration testing, checking authentication, request construction, and returned data.",
    ],
  },
];

const Experience = () => {
  const onSpotlight = useSpotlight();
  const timelineRef = useRef(null);
  const reduceMotion = useReducedMotion();
  // Named edges: 0 when the timeline's top reaches the viewport centre, 1 when
  // its bottom does. Percentage offsets ("start 75%") do not parse into a usable
  // range here -- the value pins at 1 and the line never draws.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <Section
      id="experience"
      index="03"
      label="experience"
      title="Where I've worked"
    >
      <motion.div
        ref={timelineRef}
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative pl-8 md:pl-10"
      >
        {/* Track, then an accent rule drawn over it as the section scrolls by. */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 h-full w-px bg-line"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: reduceMotion ? 1 : drawn }}
          className="absolute top-0 left-0 h-full w-px origin-top bg-accent"
        />

        {roles.map((role, idx) => (
          <motion.article
            key={role.title}
            variants={fadeUp}
            className={idx === roles.length - 1 ? "" : "mb-10"}
          >
            <div
              onPointerMove={onSpotlight}
              className="spotlight rounded-xl border border-line bg-surface p-6 transition-[transform,border-color] duration-200 hover:border-accent/40 motion-safe:hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-fg">{role.title}</h3>
                  <p className="mt-0.5 text-sm text-accent">{role.company}</p>
                </div>
                <span className="font-mono text-xs whitespace-nowrap text-faint">
                  {role.period}
                </span>
              </div>

              <ul className="mt-5 space-y-2.5">
                {role.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
};

export default Experience;
