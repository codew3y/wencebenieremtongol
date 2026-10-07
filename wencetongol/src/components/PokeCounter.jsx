import React, { useState } from "react";
import { TbHandFinger } from "react-icons/tb";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "../lib/motion";

/**
 * The rail's "pokes this month" button. Press it and the number goes up.
 * Reading and writing the tally lives in lib/pokes.js.
 */

const PokeCounter = ({ count, onPoke, folded }) => {
  // Drives the hand's nudge. Keyed off a counter rather than a boolean so a
  // fast second press restarts the motion instead of being swallowed by the
  // one still running.
  const [nudge, setNudge] = useState(0);

  const press = () => {
    setNudge((n) => n + 1);
    onPoke();
  };

  const label = `Poke. ${count} ${count === 1 ? "poke" : "pokes"} this month.`;

  const hand = (
    <motion.span
      key={nudge}
      initial={nudge === 0 ? false : { rotate: -18, scale: 1.15 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="grid shrink-0 place-items-center"
    >
      {/* Amber rather than the page accent, so it reads as its own thing
          beside the controls rather than as another nav affordance. */}
      <TbHandFinger size={15} className="text-[#F59E0B]" />
    </motion.span>
  );

  // The number swaps rather than ticks: at this size a count-up would be a
  // blur, where a single character lifting into place reads clearly.
  const number = (
    <span className="relative inline-grid h-4 min-w-[1ch] place-items-center overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={count}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className="tabular-nums text-fg"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );

  if (folded) {
    return (
      <button
        type="button"
        onClick={press}
        title={`${count} pokes this month`}
        aria-label={label}
        className="pressable flex w-full flex-col items-center gap-1 rounded-lg py-1 font-mono text-[11px] text-faint transition-colors hover:text-fg"
      >
        {hand}
        {number}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={press}
      aria-label={label}
      className="pressable group flex w-full items-center gap-2 rounded-lg py-1 font-mono text-[11px] text-faint transition-colors hover:text-fg"
    >
      {hand}
      {number}
      <span className="transition-colors group-hover:text-muted">
        pokes this month
      </span>
    </button>
  );
};

export default PokeCounter;
