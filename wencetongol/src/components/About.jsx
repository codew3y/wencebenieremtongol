import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";

const facts = [
  { label: "Role", value: "CRM Developer Associate" },
  { label: "Current company", value: "Manentia Enterprise Support PH Inc." },
  { label: "Focus", value: "Automation & API integration" },
  { label: "Based in", value: "Pampanga, Philippines" },
  { label: "Education", value: "BS Information Technology" },
  { label: "Languages", value: "Filipino (native), English (professional)" },
];

const About = () => {
  return (
    <Section id="about" index="01" label="about" title="Who I am">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="space-y-5 leading-relaxed text-muted"
        >
          <p>
            I'm a CRM developer and integrations specialist with experience in
            business-process automation, API integration, and cloud deployment. Day
            to day I work with Zoho CRM automation in Deluge, build Model Context
            Protocol (MCP) connectors on Microsoft Azure, and integrate enterprise
            systems over REST with OAuth 2.0.
          </p>
          <p>
            That work spans Microsoft Graph email search and Microsoft Purview
            eDiscovery under app-only authentication, Zoho Writer templates that
            generate client reports and investment proposals, and a FIX 4.4
            order-routing service built against a private bank's Rules of
            Engagement. I verify integrations with Postman, PowerShell, and EcoHub,
            and I care about least-privilege scopes, audit logging, and
            documentation that someone else can actually follow.
          </p>
          <p>
            I use Claude as an AI assistant throughout the development workflow —
            from drafting and debugging code to writing documentation and
            troubleshooting integrations. Alongside development, I resolve assigned
            IT helpdesk tickets.
          </p>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface"
        >
          {facts.map((fact) => (
            <div key={fact.label} className="px-5 py-4">
              <dt className="font-mono text-[11px] tracking-widest text-faint uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-fg">{fact.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </Section>
  );
};

export default About;
