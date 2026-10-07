import React from "react";
import { motion } from "framer-motion";
import { TbArrowRight, TbChevronDown } from "react-icons/tb";
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

// The tiles beside the statement. Deliberately rounded down: 13 repositories
// and client projects become "10+", 36 technology entries become "20+". A
// claim nobody can dispute is worth more here than a precise one.
const STATS = [
  { value: "10+", label: "Projects built" },
  { value: "20+", label: "Technologies" },
  { value: "1+", label: "Year experience" },
];

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (step = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: step * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Home = () => {
  const { typed, done } = useTypewriter(PROMPT, {
    speed: 18,
    startDelay: PROMPT_DELAY,
  });

  return (
    <section
      id="home"
      className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-6 pt-28 pb-20"
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
            full-stack developer
          </motion.p>

          {/* Two lines, the second dropped to muted: the statement lands on the
              first and resolves on the second. */}
          <motion.h1
            variants={rise}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-fg sm:text-[2.5rem] lg:text-[3rem]"
          >
            I build scalable web applications
            <br />
            <span className="text-muted">
              and deliver high-performance solutions.
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-7 max-w-xl leading-relaxed text-muted"
          >
            I develop reliable digital solutions and responsive user experiences
            powered by modern web technologies and Generative AI, working across
            the full stack from the interfaces people use to the services and
            data behind them.
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
              className="pressable group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-fg transition-opacity hover:opacity-90"
            >
              See the work
              <TbArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#about"
              className="pressable inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-semibold text-fg transition-colors hover:border-accent/60 hover:text-accent"
            >
              About me
            </a>
          </motion.div>
        </div>

        {/* The object on the right. It replaced a drawn bank card, which looked
            like something but told a visitor nothing. Three counts instead,
            every one of them checkable. Gone below lg, where it would only
            squeeze the statement. */}
        <div className="hidden lg:block">
          {/* What the numbers are attached to. Without it the three counts
              arrive with nothing introducing them. */}
          <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
            Currently
          </p>
          <p className="mt-3 text-lg leading-snug font-semibold tracking-[-0.01em] text-fg">
            CRM Developer Associate
          </p>
          <p className="mt-1 text-sm text-muted">
            Manentia Enterprise Support PH Inc.
          </p>

          <dl className="mt-7 grid grid-cols-3 gap-px border-y border-line">
            {STATS.map((stat) => (
              <div key={stat.label} className="py-5">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-3xl leading-none font-semibold tracking-[-0.03em] text-fg">
                    {stat.value}
                  </span>
                  <span className="mt-2.5 block font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
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
        className="pressable mx-auto mt-10 hidden h-10 w-10 place-items-center rounded-full border border-line text-faint transition-colors hover:border-accent/50 hover:text-accent sm:grid"
      >
        <TbChevronDown size={18} className="motion-safe:animate-bounce" />
      </motion.a>
    </section>
  );
};

export default Home;
