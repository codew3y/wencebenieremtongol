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
 *
 * `large` is the dialog size, scaled to sit at the same height as a project's
 * screenshots so both kinds of card open into a dialog of the same proportions.
 */
const ProjectDiagram = ({
  nodes,
  footnote,
  height = "h-44",
  large = false,
}) => (
  <div
    className={`diagram-grid flex w-full flex-col items-center justify-center overflow-hidden bg-canvas-2 px-3 py-4 sm:px-5 ${
      large ? "gap-5" : "gap-3"
    } ${height}`}
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
              className={`flex flex-1 items-center px-1 text-accent/70 ${
                large ? "mt-6 sm:mt-7" : "mt-5"
              }`}
            >
              <span className="h-px flex-1 bg-accent/40" />
              <TbChevronRight
                className={`shrink-0 ${large ? "text-sm" : "text-xs"}`}
              />
            </motion.span>
          )}

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
            }}
            className={`flex w-[20%] shrink-0 flex-col items-center text-center ${
              large ? "gap-2.5" : "gap-1.5"
            }`}
          >
            <span
              className={`grid place-items-center rounded-lg border border-accent/25 bg-accent-soft text-accent ${
                large
                  ? "h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl"
                  : "h-10 w-10 text-lg sm:h-11 sm:w-11"
              }`}
            >
              <node.Icon />
            </span>
            <span
              className={`font-mono leading-tight font-medium text-fg ${
                large
                  ? "text-[11px] sm:text-[13px]"
                  : "text-[10px] sm:text-[11px]"
              }`}
            >
              {node.label}
            </span>
            {node.sub && (
              // In the card these are the first thing to go when space runs out;
              // at dialog size there is always room.
              <span
                className={`font-mono leading-tight text-muted ${
                  large
                    ? "text-[10px] sm:text-[12px]"
                    : "hidden text-[10px] sm:block"
                }`}
              >
                {node.sub}
              </span>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </motion.div>

    {footnote && (
      <p
        className={`w-full text-center font-mono leading-tight text-muted ${
          large ? "text-[10px] sm:text-[11px]" : "text-[9px] sm:text-[10px]"
        }`}
      >
        {footnote}
      </p>
    )}
  </div>
);

export default ProjectDiagram;
