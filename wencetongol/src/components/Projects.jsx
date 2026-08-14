import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { SiClaude, SiZoho } from "react-icons/si";
import {
  TbArrowsExchange,
  TbBraces,
  TbBrandOauth,
  TbBuildingBank,
  TbFileCheck,
  TbFileText,
  TbPlugConnected,
  TbServer2,
  TbTopologyStar3,
} from "react-icons/tb";
import Section from "./Section";
import ProjectDiagram from "./ProjectDiagram";
import ProjectGallery from "./ProjectGallery";
import { fadeUp, stagger, viewportOnce } from "../lib/motion";

import VR1 from "../assets/img/projectsimg/VR1.webp";
import VR2 from "../assets/img/projectsimg/VR2.webp";
import VR3 from "../assets/img/projectsimg/VR3.webp";
import VR4 from "../assets/img/projectsimg/VR4.webp";
import port1 from "../assets/img/projectsimg/port1.webp";
import port2 from "../assets/img/projectsimg/port2.webp";
import port3 from "../assets/img/projectsimg/port3.webp";
import port4 from "../assets/img/projectsimg/port4.webp";
import port5 from "../assets/img/projectsimg/port5.webp";
import port6 from "../assets/img/projectsimg/port6.webp";
import port7 from "../assets/img/projectsimg/port7.webp";

const professional = [
  {
    name: "JB FIX System",
    subtitle: "Private-Bank Order-Routing Connector (FIX 4.4)",
    year: "2026",
    tech: [
      "Python",
      "FIX 4.4",
      "QuickFIX/J",
      "quickfix",
      "Mutual TLS",
      "SQLite",
      "pytest",
    ],
    diagram: {
      nodes: [
        { Icon: TbBuildingBank, label: "Asset manager" },
        { Icon: TbArrowsExchange, label: "FIX 4.4", sub: "mutual TLS" },
        { Icon: TbTopologyStar3, label: "NYFIX hub" },
        { Icon: TbBuildingBank, label: "Private bank" },
      ],
      footnote: "validate → persist → send · SHA-256 hash-chained audit trail",
    },
    points: [
      "Engineered a runnable FIX 4.4 order-routing service connecting an external asset manager to a private bank via the Broadridge/NYFIX hub, conforming to the bank's FIX Rules of Engagement with pre-trade validation and a persist-before-send order pipeline.",
      "Implemented resilience and security — auto-reconnect with Order Status reconciliation, sequence gap-fill recovery, idempotent order handling, mutual-TLS transport, and a tamper-evident SHA-256 hash-chained audit trail.",
      "Evaluated production FIX engines (QuickFIX/J vs quickfix), added outbound rate-limiting and a Prometheus metrics/alerting endpoint, and proved the system end-to-end against a bank/NYFIX simulator with a 58-test automated suite.",
    ],
  },
  {
    name: "Enterprise MCP Connectors",
    subtitle: "Identity-Aware Integrations on Azure",
    year: "2026",
    tech: [
      "Node.js",
      "Microsoft Azure",
      "Microsoft Graph",
      "Microsoft Entra ID",
      "OAuth 2.0",
      "Azure Key Vault",
      "GitHub Actions",
    ],
    diagram: {
      nodes: [
        { Icon: SiClaude, label: "Claude" },
        {
          Icon: TbPlugConnected,
          label: "MCP server",
          sub: "Azure App Service",
        },
        { Icon: TbBrandOauth, label: "Entra ID", sub: "OAuth 2.0 · PKCE" },
        {
          Icon: TbServer2,
          label: "Enterprise APIs",
          sub: "Graph · Purview · Bexio",
        },
      ],
      footnote: "least-privilege scopes · per-user identity · audit logging",
    },
    connectors: [
      {
        name: "MWC Mail Search",
        desc: "Read-only email search across 240+ Exchange Online mailboxes via Microsoft Graph, secured with Microsoft Entra ID OAuth 2.0 (PKCE), an approved-user allowlist, and Exchange Online Application Access Policy scoping.",
      },
      {
        name: "MWC Purview eDiscovery",
        desc: "Full Purview eDiscovery workflow (case, KQL search, review set, tamper-evident export) across the tenant, with least-privilege app-only permissions, audit logging to Application Insights, and resilient retry/backoff on throttling.",
      },
      {
        name: "BexioMCP",
        desc: "Natural-language access to Bexio accounting data across 40 read and write tools, with Microsoft Entra ID OAuth 2.0 (PKCE), Azure Key Vault secret management, and GitHub Actions CI/CD for a zero-long-lived-secret deployment pipeline.",
      },
    ],
  },
  {
    name: "Financial Planning Report Automation",
    subtitle: "CRM-Driven Document Generation in Zoho",
    year: "2026",
    tech: ["Zoho CRM", "Zoho Writer", "Zoho Deluge", "Document automation"],
    diagram: {
      nodes: [
        { Icon: SiZoho, label: "CRM record" },
        { Icon: TbBraces, label: "Deluge function" },
        { Icon: TbFileText, label: "Writer template" },
        { Icon: TbFileCheck, label: "Client report" },
      ],
      footnote: "six investment providers · conditional sections and pages",
    },
    points: [
      "Built the Financial Planning Report (FPR) generator end to end — a Zoho Writer template covering report layout, sections, field placement, and conditional pages, driven by a Deluge function that maps Zoho CRM client records into the finished document.",
      "Mapped CRM fields to Writer merge fields and validated the output against the existing Excel-based reports, correcting compounding and annual-versus-monthly calculations, and reviewing logs for template and computation faults.",
      "Generated beta reports across multiple client records rather than a single sample, and worked around Zoho Writer limits — chart configuration constraints and page breaks that produced blank pages.",
      "Revised retirement analysis and social retirement benefit handling on adviser feedback, separating automated values from those needing manual adviser input, then documented the template and function for handover.",
    ],
  },
];

const personal = [
  {
    name: "VistaVR",
    subtitle: "Virtual Reality Eye Testing Application",
    meta: "Undergraduate Capstone",
    tech: ["Unity", "C#"],
    images: [
      { src: VR1, alt: "VistaVR title screen" },
      { src: VR2, alt: "Visual acuity chart rendered in the VR headset view" },
      { src: VR3, alt: "Screening test running in the virtual room" },
      { src: VR4, alt: "Test result record" },
    ],
    points: [
      "Created a mobile virtual reality (VR) application for digital vision assessment, used with a VR headset enclosure.",
      "Built visual acuity, colour blindness, and astigmatism screening, with voice recognition for hands-free operation and printable result records.",
    ],
    link: null,
  },
  {
    name: "Personal Portfolio Website",
    subtitle: "This site",
    meta: "wencetongol.vercel.app",
    tech: ["ReactJS", "Tailwind CSS"],
    images: [
      { src: port1, alt: "Portfolio hero section" },
      { src: port2, alt: "About section" },
      { src: port3, alt: "Technical stack section" },
      { src: port4, alt: "Experience timeline" },
      { src: port5, alt: "Projects section" },
      { src: port6, alt: "Background and certifications" },
      { src: port7, alt: "Contact section" },
    ],
    points: [
      "Designed and published a responsive site presenting technical skills, project work, and professional background, with a light and dark theme.",
    ],
    link: "https://wencetongol.vercel.app/",
  },
];

const TechTags = ({ items }) => (
  <div className="mt-4 flex flex-wrap gap-2">
    {items.map((item) => (
      <span
        key={item}
        className="rounded border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-faint"
      >
        {item}
      </span>
    ))}
  </div>
);

const Projects = () => {
  return (
    <Section
      id="projects"
      index="04"
      label="projects"
      title="Things I've built"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-mono text-xs tracking-[0.2em] text-accent">
          // MWC Group projects
        </h3>
        {/* Says why there are diagrams here and screenshots further down. Framed
            as discretion, which is the point: this work runs on client data. */}
        <p className="font-mono text-[11px] text-faint">
          Screenshots withheld — client and firm systems. Architecture shown
          instead.
        </p>
      </div>

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-5 space-y-6"
      >
        {professional.map((project) => (
          <motion.article
            key={project.name}
            variants={fadeUp}
            className="overflow-hidden rounded-xl border border-line bg-surface transition-[transform,border-color] duration-200 hover:border-accent/40 motion-safe:hover:-translate-y-0.5"
          >
            {project.diagram && <ProjectDiagram {...project.diagram} />}

            <div className="p-6 md:p-7">
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-fg">
                    {project.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-accent">
                    {project.subtitle}
                  </p>
                </div>
                <span className="font-mono text-xs text-faint">
                  {project.year}
                </span>
              </div>

              <TechTags items={project.tech} />

              {project.points && (
                <ul className="mt-5 space-y-2.5">
                  {project.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {project.connectors && (
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {project.connectors.map((connector) => (
                    <div
                      key={connector.name}
                      className="rounded-lg border border-line bg-canvas-2 p-4"
                    >
                      <h4 className="font-mono text-sm font-semibold text-fg">
                        {connector.name}
                      </h4>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">
                        {connector.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </motion.div>

      <h3 className="mt-14 font-mono text-xs tracking-[0.2em] text-accent">
        // personal projects
      </h3>

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-5 grid gap-6 md:grid-cols-2"
      >
        {personal.map((project) => (
          <motion.article
            key={project.name}
            variants={fadeUp}
            className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[transform,border-color] duration-200 hover:border-accent/40 motion-safe:hover:-translate-y-0.5"
          >
            {project.images && (
              <ProjectGallery images={project.images} name={project.name} />
            )}

            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-base font-semibold text-fg">
                    {project.name}
                  </h4>
                  <p className="mt-0.5 text-sm text-accent">
                    {project.subtitle}
                  </p>
                  <p className="mt-1 font-mono text-xs text-faint">
                    {project.meta}
                  </p>
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name}`}
                    className="shrink-0 rounded-lg border border-line p-2 text-muted transition-colors group-hover:border-accent/50 group-hover:text-accent"
                  >
                    <FiArrowUpRight />
                  </a>
                )}
              </div>

              <ul className="mt-4 space-y-2.5">
                {project.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <TechTags items={project.tech} />
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
};

export default Projects;
