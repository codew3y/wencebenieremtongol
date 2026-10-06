import React, { useCallback, useState } from "react";
import { TbArrowUpRight, TbChevronRight, TbArrowsExchange, TbBraces, TbBrandOauth, TbBuildingBank, TbCoins, TbFileCheck, TbFileText, TbPlugConnected, TbServer2, TbTopologyStar3 } from "react-icons/tb";
import { SiClaude, SiZoho } from "react-icons/si";
import { motion } from "framer-motion";
import Section from "./Section";
import ProjectModal from "./ProjectModal";
import { fadeUp, stagger, viewportOnce } from "../lib/motion";

import BH1 from "../assets/img/projectsimg/BH1.webp";
import BH2 from "../assets/img/projectsimg/BH2.webp";
import BH3 from "../assets/img/projectsimg/BH3.webp";
import BH4 from "../assets/img/projectsimg/BH4.webp";
import BH5 from "../assets/img/projectsimg/BH5.webp";
import VR1 from "../assets/img/projectsimg/VR1.webp";
import VR2 from "../assets/img/projectsimg/VR2.webp";
import VR3 from "../assets/img/projectsimg/VR3.webp";
import VR4 from "../assets/img/projectsimg/VR4.webp";

// Cards carry `summary`; `points` is the detail that opens in the dialog.
const professional = [
  {
    name: "JB FIX System",
    subtitle: "Private-Bank Order-Routing Connector (FIX 4.4)",
    category: "Integration engineering",
    role: "CRM Developer Associate",
    year: "2026",
    summary:
      "A runnable FIX 4.4 order-routing service connecting an external asset manager to a private bank through the Broadridge/NYFIX hub, built against the bank's Rules of Engagement: pre-trade validation, a persist-before-send pipeline, session recovery, and a tamper-evident audit trail.",
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
      "Implemented resilience and security: auto-reconnect with Order Status reconciliation, sequence gap-fill recovery, idempotent order handling, mutual-TLS transport, and a tamper-evident SHA-256 hash-chained audit trail.",
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
      "Three Model Context Protocol connectors on Azure that expose enterprise systems to AI assistants under per-user identity and audit control. Microsoft Graph mail search, Purview eDiscovery, and Bexio accounting, each on least-privilege scopes with no long-lived secrets.",
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
      "End-to-end automation of the Financial Planning Report in Zoho: a Writer template driven by a Deluge function that maps CRM client records into a finished, adviser-ready document, extended across two regulatory regimes, each with its own template and business logic.",
    tech: ["Zoho CRM", "Zoho Writer", "Zoho Deluge", "Document automation"],
    diagram: {
      nodes: [
        { Icon: SiZoho, label: "CRM record" },
        { Icon: TbBraces, label: "Deluge function" },
        { Icon: TbFileText, label: "Writer template" },
        { Icon: TbFileCheck, label: "Client report" },
      ],
      footnote: "two regulatory regimes · conditional sections and pages",
    },
    points: [
      "Built the Financial Planning Report (FPR) generator end to end: a Zoho Writer template covering report layout, sections, field placement, and conditional pages, driven by a Deluge function that maps Zoho CRM client records into the finished document.",
      "Mapped CRM fields to Writer merge fields and validated the output against the existing Excel-based reports, correcting compounding and annual-versus-monthly calculations, and reviewing logs for template and computation faults.",
      "Generated beta reports across multiple client records rather than a single sample, and worked around Zoho Writer limits, chart configuration constraints and page breaks that produced blank pages.",
      "Revised retirement analysis and social retirement benefit handling on adviser feedback, separating automated values from those needing manual adviser input, then documented the template and function for handover.",
    ],
  },
  {
    name: "Investment Proposal Automation",
    subtitle: "Portfolio Proposals from CRM Holdings Data",
    category: "Document automation",
    role: "IT Intern → CRM Developer Associate",
    year: "2026",
    summary:
      "Automated generation of client investment proposals in Zoho, assembling portfolio structure, holdings, ISIN, KIID and factsheet data out of CRM into adviser-ready output, including multi-currency totals converted back to each holding's own currency rather than the account's.",
    tech: [
      "Zoho CRM",
      "Zoho Writer",
      "Zoho Deluge",
      "Multi-currency handling",
      "Document automation",
    ],
    diagram: {
      nodes: [
        { Icon: SiZoho, label: "CRM holdings" },
        { Icon: TbBraces, label: "Deluge mapping" },
        { Icon: TbCoins, label: "Currency logic", sub: "base → original" },
        { Icon: TbFileCheck, label: "Proposal" },
      ],
      footnote: "portfolio · holdings · property · pension sections",
    },
    points: [
      "Analysed the investment proposal workflow end to end, covering portfolio structure, holdings, and the output advisers expect, then mapped the data fields needed to generate it.",
      "Mapped investment holdings, ISIN, KIID, and factsheet data across related Zoho CRM modules into the proposal template, so a proposal assembles from records already on file instead of manual re-entry.",
      "Validated the calculations behind the cash, investments, medium-term investments, property, and pension sections against the existing Excel references, correcting compounding and annual-versus-monthly errors.",
      "Fixed multi-currency handling so total asset values convert back to each holding's original currency rather than reporting everything in the account currency, and built multi-currency test cases before sign-off.",
      "Extended the automation across six investment providers, each with its own template and business logic, then documented the templates and left maintenance notes for handover.",
    ],
  },
];

const personal = [
  {
    name: "BarberHouse",
    subtitle: "Barbershop Booking Website",
    category: "Full-stack web development",
    role: "Developer",
    year: "2026",
    summary:
      "A booking site for a Quezon City barbershop: pick a barber, pick a service, pick a slot, and hold the chair with a 20% downpayment paid by QR. Availability is live per barber, and customers reschedule or cancel from their own dashboard instead of calling the shop.",
    tech: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "REST API",
      "Vercel",
    ],
    images: [
      { src: BH1, alt: "BarberHouse landing page" },
      { src: BH2, alt: "Service menu priced per barber" },
      { src: BH3, alt: "Booking step one: barber and service" },
      { src: BH4, alt: "Booking step two: calendar and open slots" },
      { src: BH5, alt: "Booking step three: review and QR downpayment" },
    ],
    points: [
      "Built a three-step booking flow: barber and service, then date and time, then review and checkout, with each step gated on the one before it.",
      "Modelled pricing per barber rather than per service, so the same cut carries a different price and downpayment depending on whose chair it is.",
      "Generated live availability per barber in 15-minute slots, split across morning and afternoon, with service duration and buffers taken off the open times.",
      "Held chairs on a 20% downpayment paid by QR through GCash, Maya, or a bank app, confirmed automatically, with the balance settled at the shop.",
      "Gave customers an authenticated dashboard to reschedule or cancel on their own, releasing the slot back to the queue immediately, and served shop, staff, and service data over a versioned REST API so the site is not tied to one shop's content.",
    ],
    link: "https://barberhouseph.vercel.app",
    repo: "https://github.com/codew3y/barber-shop-system",
  },
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
];

// Row per project, with the project's own image sitting at the right-hand end
// of its row. The 2x3 card grid this replaced ran to two full screens and gave
// every project identical weight; a list scans in one pass and each row still
// carries its own picture.

const Thumb = ({ project }) => (
  <span className="hidden h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas-2 sm:block">
    {project.images ? (
      <img
        src={project.images[0].src}
        alt={project.images[0].alt}
        loading="lazy"
        className="h-full w-full object-cover object-top grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.04] group-hover:grayscale-0 motion-reduce:transition-none"
      />
    ) : (
      // Client work has a generated diagram rather than a screenshot. The full
      // diagram does not survive being shrunk to this size -- the labels pile
      // on top of each other -- so the thumbnail keeps only its icons and the
      // path between them. The labelled version is in the dialog.
      <span className="flex h-full w-full items-center justify-center gap-1 bg-accent-soft px-2">
        {project.diagram.nodes.map((node, index) => (
          <React.Fragment key={node.label}>
            {index > 0 && (
              <TbChevronRight className="shrink-0 text-accent/40" size={10} />
            )}
            <node.Icon className="shrink-0 text-accent" size={15} />
          </React.Fragment>
        ))}
      </span>
    )}
  </span>
);

const Projects = () => {
  const [active, setActive] = useState(null);
  const close = useCallback(() => setActive(null), []);

  const row = (project) => (
    <motion.li key={project.name} variants={fadeUp} className="min-w-0">
      <button
        type="button"
        onClick={() => setActive(project)}
        className="group flex w-full min-w-0 items-center gap-5 border-t border-line py-4 text-left transition-colors hover:border-accent/40"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 text-[1.0625rem] font-semibold tracking-[-0.01em] text-fg transition-colors group-hover:text-accent sm:truncate">
              {project.name}
            </span>
            <span className="shrink-0 font-mono text-xs text-faint">
              {project.year ?? project.meta}
            </span>
          </span>
          <span className="mt-1 block text-sm text-muted sm:truncate">
            {project.subtitle}
          </span>
        </span>

        <Thumb project={project} />

        <TbArrowUpRight
          className="shrink-0 text-faint transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          size={16}
        />
      </button>
    </motion.li>
  );

  return (
    <Section id="projects" title="Things I've built">
      <motion.div
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="min-w-0"
      >
        <h3 className="font-mono text-xs tracking-[0.2em] text-accent">
          personal projects
        </h3>
        <ul className="mt-3">{personal.map(row)}</ul>

        <div className="mt-10 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="font-mono text-xs tracking-[0.2em] text-accent">
            MWC Group projects
          </h3>
          {/* Says why these carry diagrams where the personal work above
              carries screenshots. Framed as discretion, which is the point:
              this work runs on client data. */}
          <p className="font-mono text-[11px] text-faint">
            Screenshots withheld, client and firm systems
          </p>
        </div>
        <ul className="mt-3">{professional.map(row)}</ul>
      </motion.div>

      <ProjectModal project={active} onClose={close} />
    </Section>
  );
};

export default Projects;
