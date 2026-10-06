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
      { name: "JavaScript", Icon: SiJavascript },
      { name: "TypeScript", Icon: SiTypescript },
      { name: "Node.js", Icon: SiNodedotjs },
      { name: "Python", Icon: SiPython },
      { name: "Zoho Deluge", Icon: SiZoho },
      { name: "HTML", Icon: SiHtml5 },
      { name: "CSS", Icon: SiCss3 },
      { name: "SQL", Icon: TbSql },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "ReactJS", Icon: SiReact },
      { name: "Next.js", Icon: SiNextdotjs },
      { name: "Tailwind CSS", Icon: SiTailwindcss },
    ],
  },
  {
    title: "Cloud & Identity",
    items: [
      { name: "Microsoft Azure", Icon: TbBrandAzure },
      { name: "OAuth 2.0", Icon: TbBrandOauth },
      { name: "JSON Web Tokens (JWT)", Icon: SiJsonwebtokens },
    ],
  },
  {
    title: "Platforms & APIs",
    items: [
      { name: "Zoho CRM", Icon: SiZoho },
      { name: "Zoho Writer", Icon: SiZoho },
      { name: "Zoho Flow", Icon: SiZoho },
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
      { name: "MySQL", Icon: SiMysql },
      { name: "MongoDB", Icon: SiMongodb },
      { name: "PostgreSQL", Icon: SiPostgresql },
      { name: "Supabase", Icon: SiSupabase },
      // No Neon mark in this react-icons version; Neon is serverless Postgres,
      // so the Postgres elephant is the honest stand-in.
      { name: "Neon", Icon: SiPostgresql },
    ],
  },
  {
    title: "Testing & Tooling",
    items: [
      { name: "Postman", Icon: SiPostman },
      { name: "PowerShell", Icon: TbBrandPowershell },
      { name: "Docker", Icon: SiDocker },
      { name: "Git", Icon: SiGit },
      { name: "GitHub Actions", Icon: SiGithubactions },
      { name: "Vitest", Icon: SiVitest },
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
      { name: "Claude", Icon: SiClaude },
      { name: "Claude Code", Icon: TbTerminal2 },
      { name: "Claude Cowork", Icon: SiAnthropic },
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
    <item.Icon aria-hidden="true" className="shrink-0 text-[14px] text-accent" />
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
