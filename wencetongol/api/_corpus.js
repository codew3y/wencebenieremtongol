// Everything the assistant is allowed to know, and the only thing it answers
// from. The leading underscore keeps Vercel from routing this as an endpoint.
//
// This restates what the site already says, as prose the model can quote back.
// It has to be updated when the sections change -- test/corpus.test.js fails if
// a project reaches Projects.jsx without reaching this file, which is the drift
// that would otherwise go unnoticed for months.

export const CORPUS = `
# Wence Benierem Tongol

CRM Developer and integrations specialist based in Pampanga, Philippines.
Focus: integrations and automation. Stack: Deluge, Node.js, Azure.
Languages spoken: Filipino (native), English (professional).
Contact: tongolwey@gmail.com. Portfolio: wencetongol.vercel.app.
GitHub: github.com/codew3y. He is on LinkedIn; the link is in the site footer.

He automates business processes and connects enterprise systems -- Zoho CRM
automation in Deluge, MCP connectors on Microsoft Azure, and REST integrations
secured with OAuth 2.0. He uses Claude throughout the development workflow,
from drafting and debugging code to documentation and integration
troubleshooting.

# Experience

## CRM Developer Associate, Manentia Enterprise Support PH Inc. (Jun 2026 - present)
- Automates Zoho CRM processes using Deluge scripting and Zoho Writer templates
  that generate client reports and investment proposals.
- Delivers custom MCP connectors on Azure App Service, exposing enterprise
  systems to AI assistants under per-user identity and audit control.
- Integrates Microsoft Graph email search and Microsoft Purview eDiscovery
  through app-only OAuth 2.0, applying least-privilege scopes and audit logging.
- Engineers a FIX 4.4 order-routing service in Python against a private bank's
  Rules of Engagement -- mutual-TLS transport, session recovery, engine
  evaluation (QuickFIX/J against quickfix), and an end-to-end simulator suite.
- Verifies REST integrations with Postman, PowerShell, and EcoHub, exercising
  token handling, payload structure, and failure paths.
- Resolves assigned IT helpdesk tickets alongside development work.

## Information Technology Intern (OJT), Manentia Enterprise Support PH Inc. (Feb 2026 - May 2026)
- Produced and revised Zoho Writer templates driving Financial Planning Report
  (FPR) and investment proposal generation.
- Wrote Deluge functions mapping CRM records into finished report and proposal
  documents.
- Extended proposal automation across six investment providers, each with its
  own template and business logic.
- Diagnosed Zoho Writer rendering faults -- chart configuration limits, page
  breaks, blank pages -- through iterative testing.
- Assisted API integration testing: authentication, request construction, and
  returned data.

# Projects

## JB FIX System -- Private-Bank Order-Routing Connector (FIX 4.4), 2026
Integration engineering, as CRM Developer Associate. A runnable FIX 4.4
order-routing service connecting an external asset manager to a private bank
through the Broadridge/NYFIX hub, built against the bank's Rules of Engagement:
pre-trade validation, a persist-before-send pipeline, session recovery, and a
tamper-evident SHA-256 hash-chained audit trail. Auto-reconnect with Order
Status reconciliation, sequence gap-fill recovery, idempotent order handling,
mutual-TLS transport, outbound rate limiting, a Prometheus metrics endpoint,
and a 58-test automated suite against a bank/NYFIX simulator.
Tech: Python, FIX 4.4, QuickFIX/J, quickfix, mutual TLS, SQLite, pytest.

## Enterprise MCP Connectors -- Identity-Aware Integrations on Azure, 2026
Cloud and identity, as CRM Developer Associate. Three Model Context Protocol
connectors on Azure exposing enterprise systems to AI assistants under per-user
identity and audit control, on least-privilege scopes with no long-lived
secrets. Tech: Node.js, Microsoft Azure, Microsoft Graph, Microsoft Entra ID,
OAuth 2.0, Azure Key Vault, GitHub Actions.
- MWC Mail Search: read-only email search across Exchange Online mailboxes via
  Microsoft Graph, secured with Entra ID OAuth 2.0 (PKCE), an approved-user
  allowlist, and Exchange Online Application Access Policy scoping.
- MWC Purview eDiscovery: full Purview eDiscovery workflow (case, KQL search,
  review set, tamper-evident export) with least-privilege app-only permissions,
  audit logging to Application Insights, and retry/backoff on throttling.
- BexioMCP: natural-language access to Bexio accounting data across 40 read and
  write tools, with Entra ID OAuth 2.0 (PKCE), Azure Key Vault secret
  management, and GitHub Actions CI/CD for zero long-lived secrets.

## Financial Planning Report Automation -- CRM-Driven Document Generation in Zoho, 2026
Document automation, as IT Intern then CRM Developer Associate. End-to-end
automation of the Financial Planning Report in Zoho: a Writer template driven by
a Deluge function mapping CRM client records into a finished, adviser-ready
document, extended across two regulatory regimes each with its own template and
business logic. Included correcting compounding and annual-versus-monthly
calculations, validating against the existing Excel-based reports, and
separating automated values from those needing manual adviser input.
Tech: Zoho CRM, Zoho Writer, Zoho Deluge, document automation.

## Investment Proposal Automation -- Portfolio Proposals from CRM Holdings Data, 2026
Document automation, as IT Intern then CRM Developer Associate. Automated
generation of client investment proposals in Zoho, assembling portfolio
structure, holdings, ISIN, KIID and factsheet data out of CRM into
adviser-ready output, including multi-currency totals converted back to each
holding's own currency rather than the account's.
Tech: Zoho CRM, Zoho Writer, Zoho Deluge, multi-currency handling.

## VistaVR -- Virtual Reality Eye Testing Application
Undergraduate capstone, as developer. A mobile virtual reality application for
digital vision assessment, used with a VR headset enclosure. Screens visual
acuity, colour blindness, and astigmatism, with voice recognition for
hands-free operation and printable result records. Tech: Unity, C#.

## Personal Portfolio Website -- this site
Designer and developer. A single-page React portfolio with a light and dark
theme, a serverless contact endpoint on Resend with honeypot and rate-limit
spam controls, and a tested API wired to CI.
Tech: ReactJS, Tailwind CSS, Vercel Functions, Resend, node:test.

# Education

- Pampanga State University -- BS Information Technology, 2022-2026.
- Assumpta Technical High School -- Junior and Senior High School, 2016-2022.

# Certifications

- Palo Alto Networks: Cybersecurity Fundamentals, Network Security
  Fundamentals, Cloud Security Fundamentals, Security Operations Fundamentals.
- Cisco Networking Academy: Introduction to Internet of Things (IoT) and
  Digital Transformation.
- Anthropic: Claude 101, Claude Code 101, Introduction to Claude Cowork,
  AI Fluency: Frameworks & Foundation, AI Capabilities and Limitations.

# Skills

Languages: JavaScript, Node.js, Python, PHP, C#, Zoho Deluge, HTML, CSS, SQL.
Frontend: ReactJS, Tailwind CSS.
Cloud and identity: Microsoft Azure, OAuth 2.0, Microsoft Entra ID.
Platforms and APIs: Zoho CRM, Zoho Writer, Zoho Flow, Microsoft Purview
eDiscovery, Model Context Protocol.
Databases: MySQL, MongoDB.
Testing and tooling: Postman, PowerShell, EcoHub, GitHub Actions, Node.js test
runner.
Practices: REST integration, automated testing, CI/CD, audit logging,
technical documentation, incident troubleshooting.
AI tooling: Claude, used across the development workflow for code assistance,
documentation, and integration debugging.
Strengths: analytical problem solving, ownership, collaboration, clear written
communication.
`.trim();

export default CORPUS;
