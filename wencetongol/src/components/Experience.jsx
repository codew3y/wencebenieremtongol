import React from "react";
import { motion } from "framer-motion";

const roles = [
  {
    title: "CRM Developer Associate",
    company: "Manentia Enterprise Support PH Inc.",
    period: "Jun 2026 – Present",
    points: [
      "Build and maintain automated workflows and integrations in Zoho CRM using Deluge scripting and Zoho Writer templates for report and proposal generation.",
      "Developed and maintain custom MCP connectors on Microsoft Azure, integrating Microsoft Graph email search and Microsoft Purview eDiscovery with app-only OAuth 2.0 authentication and audit logging.",
      "Test and validate RESTful API integrations using Postman, EcoHub, and PowerShell — including OAuth token handling and payload validation.",
      "Built and tested a FIX 4.4 order-routing connectivity system in Python conforming to a private bank's Rules of Engagement, with mutual-TLS transport and an automated test suite.",
      "Contribute to IT Helpdesk support by resolving assigned tickets.",
    ],
  },
  {
    title: "Information Technology Intern (OJT)",
    company: "Manentia Enterprise Support PH Inc.",
    period: "Feb 2026 – May 2026",
    points: [
      "Created and revised Zoho Writer templates for Financial Planning Report and Investment Proposal automation.",
      "Developed and tested Deluge functions that mapped Zoho CRM data into automated report and proposal outputs.",
      "Worked on Investment Proposal automation for six providers, including provider-specific templates and Deluge functions.",
      "Supported API integration testing using EcoHub, Postman, and PowerShell.",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-2">
          Experience
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Where I've worked
        </h2>
      </motion.div>

      <div className="space-y-6">
        {roles.map((role, idx) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{role.title}</h3>
                <p className="text-cyan-400 text-sm">{role.company}</p>
              </div>
              <span className="text-sm text-gray-500">{role.period}</span>
            </div>
            <ul className="space-y-2">
              {role.points.map((p, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                  <span className="text-cyan-400 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
