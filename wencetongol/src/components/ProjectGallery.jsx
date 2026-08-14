import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TbChevronLeft, TbChevronRight, TbMaximize, TbX } from "react-icons/tb";

/**
 * Cover shot for a project card, opening into a lightbox for the rest of the
 * set. Only the cover loads with the page; the others are lazy, so a visitor
 * who never opens the gallery never pays for it.
 */
const ProjectGallery = ({ images, name }) => {
  const [openAt, setOpenAt] = useState(-1);
  const open = openAt >= 0;
  const count = images.length;

  const step = useCallback(
    (delta) => setOpenAt((at) => (at + delta + count) % count),
    [count],
  );

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenAt(-1);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, step]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenAt(0)}
        aria-label={`View ${name} screenshots`}
        className="group/shot relative block h-52 w-full overflow-hidden border-b border-line bg-canvas-2 sm:h-56"
      >
        {/* Grayscale at rest so the screenshots do not fight the palette; colour
            and a slow push-in on hover. */}
        <img
          src={images[0].src}
          alt={images[0].alt}
          className="h-full w-full object-cover object-top opacity-90 grayscale transition-[transform,filter,opacity] duration-500 group-hover/shot:scale-[1.03] group-hover/shot:opacity-100 group-hover/shot:grayscale-0 motion-reduce:transition-none"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas-2/70 via-transparent to-transparent" />

        <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md border border-line bg-canvas-2/90 px-2 py-1 font-mono text-[10px] text-muted backdrop-blur-sm transition-colors group-hover/shot:border-accent/50 group-hover/shot:text-accent">
          <TbMaximize />
          {count} {count === 1 ? "shot" : "shots"}
        </span>
      </button>

      {/* Portalled to the body: the card above has overflow-hidden and takes a
          transform on hover, which would make it the containing block for a
          fixed child and clip this. */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpenAt(-1)}
              role="dialog"
              aria-modal="true"
              aria-label={`${name} screenshots`}
              className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-canvas/90 p-4 backdrop-blur-sm md:p-8"
            >
              <div className="flex w-full max-w-5xl items-center justify-between gap-4">
                <p className="font-mono text-xs tracking-[0.2em] text-accent">
                  <span className="text-faint">//</span> {name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-faint">
                    {openAt + 1}/{count}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenAt(-1)}
                    aria-label="Close gallery"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <TbX />
                  </button>
                </div>
              </div>

              <div
                onClick={(event) => event.stopPropagation()}
                className="flex w-full max-w-5xl items-center gap-2 sm:gap-4"
              >
                {count > 1 && (
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous screenshot"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <TbChevronLeft />
                  </button>
                )}

                <AnimatePresence mode="wait">
                  <motion.img
                    key={images[openAt].src}
                    src={images[openAt].src}
                    alt={images[openAt].alt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="max-h-[70vh] min-w-0 flex-1 rounded-xl border border-line bg-canvas-2 object-contain"
                  />
                </AnimatePresence>

                {count > 1 && (
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next screenshot"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <TbChevronRight />
                  </button>
                )}
              </div>

              {count > 1 && (
                <div
                  onClick={(event) => event.stopPropagation()}
                  className="flex max-w-full gap-2 overflow-x-auto px-1 pb-1"
                >
                  {images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => setOpenAt(index)}
                      aria-label={`Screenshot ${index + 1}`}
                      aria-current={index === openAt ? "true" : undefined}
                      className={`h-12 w-20 shrink-0 overflow-hidden rounded-md border transition-colors ${
                        index === openAt
                          ? "border-accent"
                          : "border-line opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

export default ProjectGallery;
