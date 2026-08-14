import React from "react";
import { motion } from "framer-motion";
import { TbChevronRight } from "react-icons/tb";

/**
 * Stands in for a screenshot on the client work, which cannot be shown: it
 * draws the request path instead of the interface. Built from the site's own
 * tokens rather than a raster, so it stays sharp at any size and follows the
 * theme — and nothing that touches client or firm data goes into it.
 */
const ProjectDiagram = ({ nodes, footnote }) => (
  <div className="tech-grid relative flex h-44 w-full items-center overflow-hidden border-b border-line bg-canvas-2 px-3 sm:h-48 sm:px-6">
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
      className="flex w-full items-start justify-between"
    >
      {nodes.map((node, index) => (
        <React.Fragment key={node.label}>
          {index > 0 && (
            <motion.span
              aria-hidden="true"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.3 } },
              }}
              className="mt-4 flex flex-1 items-center px-0.5 text-accent/50 sm:mt-5 sm:px-1"
            >
              <span className="h-px flex-1 bg-accent/25" />
              <TbChevronRight className="shrink-0 text-[11px] sm:text-sm" />
            </motion.span>
          )}

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
            }}
            className="flex w-[19%] shrink-0 flex-col items-center gap-2 text-center"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-base text-accent sm:h-11 sm:w-11 sm:text-lg">
              <node.Icon />
            </span>
            <span className="font-mono text-[9px] leading-tight text-fg sm:text-[11px]">
              {node.label}
            </span>
            {node.sub && (
              <span className="font-mono text-[8px] leading-tight text-faint sm:text-[10px]">
                {node.sub}
              </span>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </motion.div>

    {footnote && (
      <p className="absolute inset-x-0 bottom-2 px-4 text-center font-mono text-[8px] text-faint sm:bottom-3 sm:text-[10px]">
        {footnote}
      </p>
    )}
  </div>
);

export default ProjectDiagram;
