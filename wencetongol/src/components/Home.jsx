import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import useTypewriter from "../hooks/useTypewriter";

/**
 * The landing screen: a statement, a line of detail, and somewhere to go.
 *
 * Deliberately thin on information -- the profile card in About carries the
 * name, photo, role and contact details. This screen's whole job is to say what
 * the work is before anyone has scrolled a pixel.
 */

const PROMPT = "automation · integration · cloud";
const PROMPT_DELAY = 900;

// The object on the right, as a bank card. The embossed-number slot carries a
// quote instead of digits -- nothing on this card should look like it could be
// charged. No network or bank marks either: the brand slot carries this site's
// own mark.
const CARD = {
  label: "integrations",
  line: "YOUR VISION, MY CODE.",
  holder: "WENCE TONGOL",
  since: "06/26",
};

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (step = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: step * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

// How far the card leans at the very edge of the pointer's travel. Past about
// 12deg the text starts to distort rather than tilt.
const MAX_TILT = 14;

const Home = () => {
  const { typed, done } = useTypewriter(PROMPT, {
    speed: 18,
    startDelay: PROMPT_DELAY,
  });

  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);

  // -0.5 to 0.5 across the card, in each axis.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]),
    spring,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]),
    spring,
  );

  const trackPointer = (event) => {
    if (reduceMotion) return;
    const box = cardRef.current?.getBoundingClientRect();
    if (!box) return;
    pointerX.set((event.clientX - box.left) / box.width - 0.5);
    pointerY.set((event.clientY - box.top) / box.height - 0.5);
  };

  const releasePointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="home"
      className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-28 pb-20"
    >
      <div className="grid items-center gap-14 lg:grid-cols-[1.65fr_1fr] lg:gap-14">
        <div>
          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-mono text-xs tracking-[0.25em] text-accent"
          >
            crm developer &amp; integrations specialist
          </motion.p>

          {/* Two lines, the second dropped to muted: the statement lands on the
              first and resolves on the second. */}
          <motion.h1
            variants={rise}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-fg sm:text-4xl lg:text-[2.5rem]"
          >
            I automate business processes
            <br />
            <span className="text-muted">and connect enterprise systems.</span>
          </motion.h1>

          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-7 max-w-xl leading-relaxed text-muted"
          >
            Automation workflows that run end to end — CRM record to finished
            document, enterprise system to AI assistant, service to service over
            REST and OAuth 2.0.
          </motion.p>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-fg transition-opacity hover:opacity-90"
            >
              See the work
              <FiArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-semibold text-fg transition-colors hover:border-accent/60 hover:text-accent"
            >
              About me
            </a>
          </motion.div>
        </div>

        {/* The object on the right: a card tilted off-axis inside a plain ring,
            so it reads as sitting on something rather than floating. Decorative,
            and gone below lg where it would only squeeze the statement. */}
        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          custom={4}
          aria-hidden="true"
          className="relative hidden aspect-square items-center justify-center [perspective:1100px] [transform-style:preserve-3d] lg:flex"
        >
          {/* The rings sit in the same 3D space as the card and are pushed
              back in Z, so the card genuinely stands in front of them rather
              than merely overlapping. Accent-tinted and stepped in strength so
              the nearest reads first. */}
          <span
            style={{ transform: "translateZ(-90px)" }}
            className="absolute h-[104%] w-[104%] rounded-full border border-accent/10"
          />
          <span
            style={{ transform: "translateZ(-70px)" }}
            className="absolute h-[86%] w-[86%] rounded-full border border-accent/20"
          />
          <span
            style={{ transform: "translateZ(-50px)" }}
            className="absolute h-[66%] w-[66%] rounded-full border-2 border-accent/30"
          />

          {/* The tilt is the parent's perspective plus rotateX/rotateY on the
              card: without perspective the rotations are a flat skew. The
              pointer drives it, a spring settles it, and it stays still for
              anyone who asked their OS to reduce motion. */}
          <motion.div
            ref={cardRef}
            onMouseMove={trackPointer}
            onMouseLeave={releasePointer}
            // The motion values are always bound; reduced motion is handled in
            // the handler, which simply never moves them off zero. Gating the
            // style instead bakes in whatever useReducedMotion returned on the
            // first render, and the card never tilts at all.
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative aspect-[1.586/1] w-[22rem] rotate-3 rounded-2xl"
          >
            {/* Thickness. A plate pushed back in Z shows along the lower edge
                as the card leans, which is what separates a solid object from
                a picture of one. No overflow-hidden anywhere on this subtree:
                clipping flattens preserve-3d and the depth collapses. */}
            <span
              aria-hidden="true"
              style={{ transform: "translateZ(-14px)" }}
              className="absolute inset-0 rounded-2xl border border-line bg-line/40"
            />

            {/* The face. */}
            <div
              style={{ transform: "translateZ(0px)" }}
              className="absolute inset-0 rounded-2xl border border-line bg-canvas-2 shadow-2xl shadow-black/40"
            />

            {/* Content, lifted toward the viewer so it parallaxes against the
                face when the card turns. */}
            <div
              style={{ transform: "translateZ(34px)" }}
              className="relative flex h-full flex-col justify-between p-6"
            >
              <div className="flex items-start justify-between">
                <p className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                  {CARD.label}
                </p>
                <p className="font-mono text-xs font-semibold text-fg">
                  <span className="text-accent">&lt;</span>wence
                  <span className="text-accent"> /&gt;</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid h-7 w-10 shrink-0 grid-cols-3 gap-px overflow-hidden rounded-[4px] bg-accent/25 p-[3px]">
                  {Array.from({ length: 9 }, (unused, index) => (
                    <span key={index} className="rounded-[1px] bg-accent/40" />
                  ))}
                </span>

                <span className="flex shrink-0 items-center gap-[3px] text-faint">
                  {[8, 11, 14, 17].map((height) => (
                    <span
                      key={height}
                      style={{ height }}
                      className="w-[2px] rounded-full bg-current"
                    />
                  ))}
                </span>

                <p className="ml-1 truncate font-mono text-sm tracking-[0.12em] text-fg">
                  {CARD.line}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[9px] tracking-[0.2em] text-faint uppercase">
                    card holder
                  </p>
                  <p className="mt-1 truncate font-mono text-xs tracking-wider text-fg">
                    {CARD.holder}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[9px] tracking-[0.2em] text-faint uppercase">
                    member since
                  </p>
                  <p className="mt-1 font-mono text-xs tracking-wider text-fg">
                    {CARD.since}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* The prompt keeps its place on the page, just not on the card. */}
      <p
        aria-hidden="true"
        className="mt-14 flex items-center gap-2 font-mono text-[11px] text-faint"
      >
        <span className="text-accent">$</span>
        <span>{typed}</span>
        <span
          className={`inline-block h-3 w-1.5 translate-y-px bg-accent ${
            done ? "motion-safe:animate-pulse" : ""
          }`}
        />
      </p>

      {/* A landing screen should say there is more below it. */}
      <motion.a
        variants={rise}
        initial="hidden"
        animate="show"
        custom={5}
        href="#about"
        aria-label="Scroll to about"
        className="mx-auto mt-10 hidden h-10 w-10 place-items-center rounded-full border border-line text-faint transition-colors hover:border-accent/50 hover:text-accent sm:grid"
      >
        <FiChevronDown size={18} className="motion-safe:animate-bounce" />
      </motion.a>
    </section>
  );
};

export default Home;
