import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

/**
 * The screenshot viewer inside a project's detail dialog: one image at a time,
 * arrows, a counter, and a thumbnail strip. Arrow keys page through it.
 */
const ProjectImages = ({ images }) => {
  const [at, setAt] = useState(0);
  const count = images.length;

  const step = useCallback(
    (delta) => setAt((current) => (current + delta + count) % count),
    [count],
  );

  useEffect(() => {
    if (count < 2) return;

    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, step]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-line bg-canvas-2">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[at].src}
            src={images[at].src}
            alt={images[at].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="max-h-[34vh] w-full object-contain sm:max-h-[42vh]"
          />
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous screenshot"
              className="absolute top-1/2 left-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-canvas/80 text-muted backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent"
            >
              <TbChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next screenshot"
              className="absolute top-1/2 right-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-canvas/80 text-muted backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent"
            >
              <TbChevronRight />
            </button>
            <span className="absolute right-3 bottom-3 rounded-md border border-line bg-canvas/85 px-2 py-1 font-mono text-[10px] text-muted backdrop-blur-sm">
              {at + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setAt(index)}
              aria-label={`Screenshot ${index + 1}`}
              aria-current={index === at ? "true" : undefined}
              className={`h-12 w-20 shrink-0 overflow-hidden rounded-md border transition-colors ${
                index === at
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
    </div>
  );
};

export default ProjectImages;
