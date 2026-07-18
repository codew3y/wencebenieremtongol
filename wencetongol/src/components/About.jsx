import React from "react";
import { motion } from "framer-motion";

const facts = [
  { label: "Role", value: "CRM Developer Associate" },
  { label: "Focus", value: "Automation & API integration" },
  { label: "Education", value: "BS Information Technology" },
  { label: "Languages", value: "Filipino, English" },
];

const About = () => {
  return (
    <section id="about" className="py-20 max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-2">
          About
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Who I am
        </h2>

        <p className="text-gray-400 leading-relaxed max-w-3xl">
          I'm a CRM Developer focused on business-process automation, workflow
          maintenance, and API integration testing. I build and maintain Zoho CRM
          automations using Deluge scripting and Zoho Writer templates, develop
          custom Model Context Protocol (MCP) connectors on Microsoft Azure, and
          integrate Microsoft Graph and Microsoft Purview eDiscovery through
          RESTful APIs secured with OAuth 2.0. I test and validate APIs with
          Postman, EcoHub, and PowerShell, and take care to produce clear
          technical documentation. I also help out with IT Helpdesk support.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {facts.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                {f.label}
              </p>
              <p className="text-sm text-gray-200 font-medium">{f.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
