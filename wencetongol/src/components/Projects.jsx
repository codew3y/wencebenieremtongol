import React, { useCallback, useState } from "react";
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
  TbMaximize,
  TbPlugConnected,
  TbServer2,
  TbTopologyStar3,
} from "react-icons/tb";
import Section from "./Section";
import ProjectDiagram from "./ProjectDiagram";
import ProjectModal from "./ProjectModal";
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

// Cards carry `summary`; `points` is the detail that opens in the dialog.
const professional = [
  {
    name: "JB FIX System",
    subtitle: "Private-Bank Order-Routing Connector (FIX 4.4)",
    category: "Integration engineering",
    role: "CRM Developer Associate",
    year: "2026",
    summary:
      "A runnable FIX 4.4 order-routing service connecting an external asset manager to a private bank through the Broadridge/NYFIX hub, built against the bank's Rules of Engagement — pre-trade validation, a persist-before-send pipeline, session recovery, and a tamper-evident audit trail.",
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
    category: "Cloud & identity",
    role: "CRM Developer Associate",
    year: "2026",
    summary:
      "Three Model Context Protocol connectors on Azure that expose enterprise systems to AI assistants under per-user identity and audit control — Microsoft Graph mail search, Purview eDiscovery, and Bexio accounting — each on least-privilege scopes with no long-lived secrets.",
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
        desc: "Read-only email search across Exchange Online mailboxes via Microsoft Graph, secured with Microsoft Entra ID OAuth 2.0 (PKCE), an approved-user allowlist, and Exchange Online Application Access Policy scoping.",
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
    category: "Document automation",
    role: "IT Intern → CRM Developer Associate",
    year: "2026",
    summary:
      "End-to-end automation of the Financial Planning Report in Zoho: a Writer template driven by a Deluge function that maps CRM client records into a finished, adviser-ready document — extended across six investment providers, each with its own template and business logic.",
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
    category: "Undergraduate capstone",
    role: "Developer",
    meta: "Capstone project",
    summary:
      "A mobile virtual reality application for digital vision assessment, used with a VR headset enclosure. Screens visual acuity, colour blindness, and astigmatism, with voice recognition for hands-free operation.",
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
    category: "Web",
    role: "Designer & developer",
    meta: "wencetongol.vercel.app",
    summary:
      "This site: a single-page React portfolio with a light and dark theme, a serverless contact endpoint on Resend with honeypot and rate-limit spam controls, and a tested API wired to CI.",
    tech: [
      "ReactJS",
      "Tailwind CSS",
      "Vercel Functions",
      "Resend",
      "node:test",
    ],
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
      "Built the contact form as a Vercel Function on Resend, with a honeypot, per-IP rate limiting in Redis, and a 17-test suite run by GitHub Actions.",
    ],
    link: "https://wencetongol.vercel.app/",
  },
];

const VISIBLE_TAGS = 4;

const TechTags = ({ items }) => (
  <div className="mt-4 flex flex-wrap gap-2">
    {items.slice(0, VISIBLE_TAGS).map((item) => (
      <span
        key={item}
        className="rounded border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-faint"
      >
        {item}
      </span>
    ))}
    {items.length > VISIBLE_TAGS && (
      <span className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-faint">
        +{items.length - VISIBLE_TAGS}
      </span>
    )}
  </div>
);

const Cover = ({ project }) => (
  <div className="relative h-52 overflow-hidden border-b border-line bg-canvas-2 sm:h-56">
    {/* Greyscale at rest so screenshots do not fight the palette; colour and a
        slow push-in as the card is hovered. */}
    <img
      src={project.images[0].src}
      alt={project.images[0].alt}
      className="h-full w-full object-cover object-top opacity-90 grayscale transition-[transform,filter,opacity] duration-500 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0 motion-reduce:transition-none"
    />
    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas-2/70 via-transparent to-transparent" />
    <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md border border-line bg-canvas-2/90 px-2 py-1 font-mono text-[10px] text-muted backdrop-blur-sm transition-colors group-hover:border-accent/50 group-hover:text-accent">
      <TbMaximize />
      {project.images.length} shots
    </span>
  </div>
);

const Projects = () => {
  const [active, setActive] = useState(null);
  const close = useCallback(() => setActive(null), []);

  // The whole card is clickable for the mouse; the button inside it is what
  // keyboards and screen readers use, so the card keeps its heading semantics
  // instead of collapsing into a role="button".
  const card = (project, index) => (
    <motion.article
      key={project.name}
      variants={fadeUp}
      onClick={() => setActive(project)}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[transform,border-color] duration-200 hover:border-accent/40 motion-safe:hover:-translate-y-0.5 ${
        index === 0 && project.diagram ? "md:col-span-2" : ""
      }`}
    >
      {project.images ? (
        <Cover project={project} />
      ) : (
        <div className="border-b border-line">
          <ProjectDiagram {...project.diagram} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="text-base font-semibold text-fg md:text-lg">
            {project.name}
          </h4>
          <span className="font-mono text-xs whitespace-nowrap text-faint">
            {project.year ?? project.meta}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-accent">{project.subtitle}</p>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        <TechTags items={project.tech} />

        <div className="mt-5 flex-1" />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setActive(project);
          }}
          className="inline-flex items-center gap-1.5 self-start font-mono text-xs text-muted transition-colors group-hover:text-accent"
        >
          View details <FiArrowUpRight />
        </button>
      </div>
    </motion.article>
  );

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
          Screenshots withheld — client and firm systems
        </p>
      </div>

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-5 grid gap-6 md:grid-cols-2"
      >
        {professional.map(card)}
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
        {personal.map(card)}
      </motion.div>

      <ProjectModal project={active} onClose={close} />
    </Section>
  );
};

export default Projects;
