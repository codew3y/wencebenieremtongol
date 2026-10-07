import React, { useState } from "react";
import { TbApi, TbBook2, TbBrandAzure, TbBrandOauth, TbBrandPowershell, TbBug, TbChartDots3, TbClipboardText, TbInfinity, TbMessageDots, TbPlugConnected, TbPuzzle, TbShieldSearch, TbSql, TbTargetArrow, TbTerminal2, TbTestPipe, TbUsersGroup, TbWebhook } from "react-icons/tb";
import { SiAnthropic, SiClaude, SiCss3, SiDocker, SiGit, SiGithubactions, SiHtml5, SiJavascript, SiJsonwebtokens, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiPostgresql, SiPostman, SiPython, SiReact, SiSupabase, SiTailwindcss, SiTypescript, SiVitest, SiZoho } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import Section from "./Section";
import { EASE_OUT } from "../lib/motion";

// Brand marks where one exists; otherwise a Tabler glyph that reads as the
// thing itself (a plug for MCP, a shield-and-magnifier for eDiscovery).
const groups = [
  {
    title: "Languages",
    items: [
      { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
      { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Python", Icon: SiPython, color: "#3776AB" },
      { name: "Zoho Deluge", Icon: SiZoho, color: "#E42527" },
      { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
      { name: "CSS", Icon: SiCss3, color: "#663399" },
      { name: "SQL", Icon: TbSql },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "ReactJS", Icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", Icon: SiNextdotjs, color: "#000000", colorDark: "#ededeb" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
    ],
  },
  {
    title: "Cloud & Identity",
    items: [
      { name: "Microsoft Azure", Icon: TbBrandAzure, color: "#0078D4" },
      { name: "OAuth 2.0", Icon: TbBrandOauth },
      { name: "JSON Web Tokens (JWT)", Icon: SiJsonwebtokens, color: "#000000", colorDark: "#ededeb" },
    ],
  },
  {
    title: "Platforms & APIs",
    items: [
      { name: "Zoho CRM", Icon: SiZoho, color: "#E42527" },
      { name: "Zoho Writer", Icon: SiZoho, color: "#E42527" },
      { name: "Zoho Flow", Icon: SiZoho, color: "#E42527" },
      { name: "Microsoft Graph", Icon: TbChartDots3 },
      { name: "Microsoft Purview eDiscovery", Icon: TbShieldSearch },
      { name: "Model Context Protocol", Icon: TbPlugConnected },
      { name: "REST APIs", Icon: TbApi },
      { name: "Webhooks", Icon: TbWebhook },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
      { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
      { name: "Supabase", Icon: SiSupabase, color: "#3FCF8E" },
      // No Neon mark in this react-icons version; Neon is serverless Postgres,
      // so the Postgres elephant is the honest stand-in.
      { name: "Neon", Icon: SiPostgresql, color: "#4169E1" },
    ],
  },
  {
    title: "Testing & Tooling",
    items: [
      { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
      { name: "PowerShell", Icon: TbBrandPowershell, color: "#5391FE" },
      { name: "Docker", Icon: SiDocker, color: "#2496ED" },
      { name: "Git", Icon: SiGit, color: "#F03C2E" },
      { name: "GitHub Actions", Icon: SiGithubactions, color: "#2088FF" },
      { name: "Vitest", Icon: SiVitest, color: "#00FF74" },
    ],
  },
  {
    title: "Practices",
    items: [
      { name: "REST integration", Icon: TbApi },
      { name: "Automated testing", Icon: TbTestPipe },
      { name: "CI/CD", Icon: TbInfinity },
      { name: "Audit logging", Icon: TbClipboardText },
      { name: "Documentation", Icon: TbBook2 },
      { name: "Incident troubleshooting", Icon: TbBug },
    ],
  },
  {
    title: "AI Tooling",
    items: [
      { name: "Claude", Icon: SiClaude, color: "#D97757" },
      { name: "Claude Code", Icon: TbTerminal2 },
      { name: "Claude Cowork", Icon: SiAnthropic, color: "#191919", colorDark: "#ededeb" },
    ],
  },
  {
    title: "Strengths",
    items: [
      { name: "Analytical problem solving", Icon: TbPuzzle },
      { name: "Ownership", Icon: TbTargetArrow },
      { name: "Collaboration", Icon: TbUsersGroup },
      { name: "Clear written communication", Icon: TbMessageDots },
    ],
  },
];

// Filtered by category, and grouped inside the result.
//
// A flat wall of 46 chips had no structure: rows wrapped wherever they ran out
// of width, nothing lined up, and nothing told you where one kind of thing
// ended and the next began. Keeping the rows labelled gives the eye somewhere
// to land, and the filter still narrows to a single row when you want one.
const ALL = "All";
const categories = [ALL].concat(groups.map((group) => group.title));

const Chip = ({ item }) => (
  <motion.span
    layout
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.18, ease: EASE_OUT }}
    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas-2 px-2.5 py-1 font-mono text-[12px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
  >
    {/* Brand marks keep their own colour; the conceptual Tabler glyphs, which
        have no brand behind them, stay on the accent. */}
    <item.Icon
      aria-hidden="true"
      className={
        "shrink-0 text-[14px] " + (item.color ? "brand-icon" : "text-accent")
      }
      style={
        item.color
          ? { "--brand": item.color, "--brand-dark": item.colorDark }
          : undefined
      }
    />
    {item.name}
  </motion.span>
);

const Skills = () => {
  const [filter, setFilter] = useState(ALL);

  const visible =
    filter === ALL ? groups : groups.filter((group) => group.title === filter);
  const count = visible.reduce((total, group) => total + group.items.length, 0);

  return (
    <Section
      id="skills"
      title="Technical stack"
      intro="The languages, platforms, and practices I work with day to day."
    >
      {/* No container. The filter row and the count sit between hairlines,
          which is how Background separates its bands too. */}
      <div>
        {/* Toggle buttons rather than tabs: there is one list underneath, not
            one per category, so aria-pressed describes it honestly where
            role="tab" would promise a tabpanel that does not exist. */}
        <div
          role="group"
          aria-label="Filter the stack by category"
          className="flex flex-wrap gap-2"
        >
          {categories.map((name) => {
            const active = name === filter;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setFilter(name)}
                aria-pressed={active}
                className={
                  "pressable rounded-full border px-3 py-1.5 font-mono text-xs transition-colors " +
                  (active
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line text-muted hover:border-accent/50 hover:text-accent")
                }
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* One labelled row per category. The label column is fixed so every
            set of chips starts on the same vertical line instead of each row
            beginning wherever its own label happened to end. */}
        <motion.div layout className="mt-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((group) => (
              <motion.div
                key={group.title}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="grid gap-x-8 gap-y-3 border-t border-line py-2.5 md:grid-cols-[12rem_1fr]"
              >
                <h3 className="font-mono text-sm text-accent">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Chip key={group.title + "/" + item.name} item={item} />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <p
          aria-live="polite"
          className="border-t border-line pt-3 font-mono text-[11px] text-faint"
        >
          {count} {count === 1 ? "entry" : "entries"}
          {filter === ALL ? " across " + groups.length + " categories" : ""}
        </p>
      </div>
    </Section>
  );
};

export default Skills;
