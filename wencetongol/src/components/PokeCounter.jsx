import React, { useState } from "react";
import { TbHandFinger } from "react-icons/tb";
import { motion } from "framer-motion";
import { EASE_OUT } from "../lib/motion";

/**
 * The rail's poke tally and the button that moves it.
 *
 * The count is a reading, the pill is the control: keeping them separate is
 * why this is laid out as a label with a button beside it rather than one
 * large clickable block, which gave no clue where to press.
 *
 * Reading and writing the tally lives in lib/pokes.js.
 */

const PokeCounter = ({ count, onPoke, folded }) => {
  // null means the shared total has not arrived yet. A dash rather than a zero:
  // zero is a number, and showing it before the real one lands is how the rail
  // came to flicker between 0 and the true figure.
  const known = typeof count === "number";
  const shown = known ? count.toLocaleString() : "—";
  const label = known ? `${count} pokes this month` : "counting pokes";
  // Drives the hand's nudge. Keyed off a counter rather than a boolean so a
  // fast second press restarts the motion instead of being swallowed by the
  // one still running.
  const [nudge, setNudge] = useState(0);

  const press = () => {
    setNudge((n) => n + 1);
    onPoke();
  };

  const hand = (
    <motion.span
      key={nudge}
      initial={nudge === 0 ? false : { rotate: -20, scale: 1.2 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="grid shrink-0 place-items-center"
    >
      {/* Amber rather than the page accent, so it reads as its own thing
          beside the controls rather than as another nav affordance. */}
      <TbHandFinger size={15} className="text-[#F59E0B]" />
    </motion.span>
  );

  // The number swaps rather than ticks: a count-up at this size would be a
  // blur, where a value lifting into place reads clearly. Grouped with commas
  // so it stays readable if it ever runs long.
  //
  // Deliberately not wrapped in AnimatePresence. With mode="wait" each value
  // had to finish leaving before the next could arrive, so at 0.18s a swap the
  // display could not keep up with a spammed button: it stalled and stopped
  // redrawing entirely, while the tally behind it carried on. Pokes were
  // counted correctly and the rail simply stopped saying so -- it read 494
  // while the counter, and the button's own label, were already at 517.
  //
  // Remounting on the key alone has no exit to wait for, so the current value
  // is always what is on screen, however fast it changes, and still lifts into
  // place when it changes at a readable pace.
  const number = (
    <span className="relative inline-grid h-5 place-items-center overflow-hidden">
      <motion.span
        key={shown}
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.18, ease: EASE_OUT }}
        className="text-sm font-semibold tabular-nums text-fg"
      >
        {shown}
      </motion.span>
    </span>
  );

  if (folded) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={press}
          aria-label={`Poke. ${label}.`}
          title={label}
          className="pressable card-edge grid h-9 w-9 place-items-center rounded-full border border-line bg-surface transition-colors hover:border-accent/50"
        >
          {hand}
        </button>
        {number}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="font-mono text-[11px] whitespace-nowrap text-faint">
          Pokes this month
        </p>
        {number}
      </div>

      <button
        type="button"
        onClick={press}
        aria-label={`Poke. ${label}.`}
        className="pressable card-edge inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface py-1.5 pr-3 pl-2.5 font-mono text-xs font-semibold text-fg transition-colors hover:border-accent/50 hover:text-accent"
      >
        {hand}
        Poke
      </button>
    </div>
  );
};

export default PokeCounter;
