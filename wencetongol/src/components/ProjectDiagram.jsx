import React from "react";
import { motion } from "framer-motion";
import { TbChevronRight } from "react-icons/tb";

/**
 * Stands in for a screenshot on the client work, which cannot be shown: it draws
 * the request path instead of the interface. Built from the site's own tokens
 * rather than a raster, so it stays sharp at any size and follows the theme —
 * and nothing that touches client or firm data goes into it.
 *
 * Laid out as a column with the footnote in normal flow rather than absolutely
 * positioned, so the box can be short without the two colliding.
 */
const ProjectDiagram = ({ nodes, footnote, height = "h-44" }) => (
  <div
    className={`diagram-grid flex w-full flex-col items-center justify-center gap-3 overflow-hidden bg-canvas-2 px-3 py-4 sm:px-5 ${height}`}
  >
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
              className="mt-5 flex flex-1 items-center px-1 text-accent/70"
            >
              <span className="h-px flex-1 bg-accent/40" />
              <TbChevronRight className="shrink-0 text-xs" />
            </motion.span>
          )}

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
            }}
            className="flex w-[20%] shrink-0 flex-col items-center gap-1.5 text-center"
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/25 bg-accent-soft text-lg text-accent sm:h-11 sm:w-11">
              <node.Icon />
            </span>
            <span className="font-mono text-[10px] leading-tight font-medium text-fg sm:text-[11px]">
              {node.label}
            </span>
            {/* Sub-labels are the first thing to go when there is no room. */}
            {node.sub && (
              <span className="hidden font-mono text-[10px] leading-tight text-muted sm:block">
                {node.sub}
              </span>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </motion.div>

    {footnote && (
      <p className="w-full text-center font-mono text-[9px] leading-tight text-muted sm:text-[10px]">
        {footnote}
      </p>
    )}
  </div>
);

export default ProjectDiagram;
