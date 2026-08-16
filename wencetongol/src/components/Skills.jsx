import React from "react";
import { motion } from "framer-motion";
import {
  SiAnthropic,
  SiClaude,
  SiCss3,
  SiGit,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPostman,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiZoho,
} from "react-icons/si";
import {
  TbApi,
  TbBook2,
  TbBrandAzure,
  TbBrandOauth,
  TbBrandPowershell,
  TbBug,
  TbChartDots3,
  TbClipboardText,
  TbInfinity,
  TbMessageDots,
  TbPlugConnected,
  TbPuzzle,
  TbShieldSearch,
  TbSql,
  TbTargetArrow,
  TbTerminal2,
  TbTestPipe,
  TbTopologyStar3,
  TbUsersGroup,
  TbWebhook,
} from "react-icons/tb";
import Section from "./Section";
import { fadeUp, stagger, viewportOnce } from "../lib/motion";

// Brand marks where one exists; otherwise a Tabler glyph that reads as the
// thing itself (a plug for MCP, a shield-and-magnifier for eDiscovery).
const groups = [
  {
    title: "Languages",
    items: [
      { name: "JavaScript", Icon: SiJavascript },
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
      { name: "Webhooks", Icon: TbWebhook },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "MySQL", Icon: SiMysql },
      { name: "MongoDB", Icon: SiMongodb },
    ],
  },
  {
    title: "Testing & Tooling",
    items: [
      { name: "Postman", Icon: SiPostman },
      { name: "PowerShell", Icon: TbBrandPowershell },
      { name: "EcoHub", Icon: TbTopologyStar3 },
      { name: "Git", Icon: SiGit },
      { name: "GitHub Actions", Icon: SiGithubactions },
      { name: "Node.js test runner", Icon: SiNodedotjs },
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

const Skills = () => {
  return (
    <Section
      id="skills"
      label="skills"
      title="Technical stack"
      intro="The languages, platforms, and practices I work with day to day."
    >
      <motion.div
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="divide-y divide-line border-y border-line"
      >
        {groups.map((group) => (
          <motion.div
            key={group.title}
            variants={fadeUp}
            className="grid gap-3 py-5 md:grid-cols-[200px_1fr] md:gap-8"
          >
            <h3 className="font-mono text-sm text-accent">{group.title}</h3>
            {/* Chips cascade within their row once the row itself arrives. */}
            <motion.div
              variants={stagger(0.02)}
              className="flex flex-wrap gap-2"
            >
              {group.items.map((item) => (
                <motion.span
                  key={item.name}
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-[13px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <item.Icon
                    aria-hidden="true"
                    className="shrink-0 text-[15px] text-accent"
                  />
                  {item.name}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Skills;
