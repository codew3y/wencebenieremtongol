import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { TbX } from "react-icons/tb";
import ProjectDiagram from "./ProjectDiagram";
import ProjectImages from "./ProjectImages";
import useDialog from "../hooks/useDialog";

const Heading = ({ children }) => (
  <h4 className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
    {children}
  </h4>
);

/**
 * The detail view behind a project card: media on the left, the writing that
 * used to crowd the card on the right. Cards carry a summary now; the bullets,
 * the connector breakdown and the full stack live here.
 */
const ProjectModal = ({ project, onClose }) => {
  const open = Boolean(project);
  const panelRef = useDialog(open, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-canvas/85 p-4 backdrop-blur-sm md:items-center md:p-8"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="my-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/20 focus:outline-none"
          >
            <div className="flex items-start gap-4 border-b border-line bg-canvas-2 p-4 md:p-5">
              <div className="min-w-0">
                <span className="inline-block rounded-full border border-accent/30 bg-accent-soft px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-accent uppercase">
                  {project.category}
                </span>
                <h3
                  id="project-modal-title"
                  className="mt-2.5 text-lg font-bold tracking-tight text-fg md:text-xl"
                >
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  <span className="text-faint">Role:</span> {project.role}
                  {project.year && (
                    <span className="text-faint"> · {project.year}</span>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <TbX />
              </button>
            </div>

            <div className="grid max-h-[70vh] gap-5 overflow-y-auto p-4 md:max-h-none md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-6 md:overflow-visible md:p-6">
              {/* min-w-0: without it the column sizes to the screenshot's
                  intrinsic width (1600px), so the image spills out of the
                  dialog and the body scrolls sideways on a phone. */}
              <div className="min-w-0">
                {project.images ? (
                  <ProjectImages images={project.images} />
                ) : (
                  <div className="overflow-hidden rounded-xl border border-line">
                    <ProjectDiagram
                      {...project.diagram}
                      height="h-[34vh] sm:h-[42vh]"
                      large
                    />
                  </div>
                )}

                {!project.images && (
                  <p className="mt-3 font-mono text-[10px] leading-relaxed text-faint">
                    Screenshots withheld — this work runs on client and firm
                    systems. The diagram shows the request path instead.
                  </p>
                )}
              </div>

              <div className="min-w-0 space-y-5 md:max-h-[62vh] md:overflow-y-auto md:pr-1">
                <section className="space-y-2">
                  <Heading>Project overview</Heading>
                  <p className="text-sm leading-relaxed text-muted">
                    {project.summary}
                  </p>
                </section>

                {project.points && (
                  <section className="space-y-2">
                    <Heading>Key features &amp; highlights</Heading>
                    <ul className="space-y-2">
                      {project.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 rounded-lg border border-line bg-canvas-2 px-3 py-2.5 text-[13px] leading-relaxed text-muted"
                        >
                          <FiCheck className="mt-0.5 shrink-0 text-accent" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {project.connectors && (
                  <section className="space-y-2">
                    <Heading>Connectors</Heading>
                    <ul className="space-y-2">
                      {project.connectors.map((connector) => (
                        <li
                          key={connector.name}
                          className="rounded-lg border border-line bg-canvas-2 px-3 py-2.5"
                        >
                          <p className="font-mono text-[13px] font-semibold text-fg">
                            {connector.name}
                          </p>
                          <p className="mt-1 text-[13px] leading-relaxed text-muted">
                            {connector.desc}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="space-y-2">
                  <Heading>Technologies &amp; tools</Heading>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((item) => (
                      <span
                        key={item}
                        className="rounded border border-line bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
                  >
                    Visit live site <FiArrowUpRight />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ProjectModal;
