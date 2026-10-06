import React, { useCallback, useEffect, useState } from "react";
import {
  TbBriefcase,
  TbFolders,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
  TbMail,
  TbMenu2,
  TbSchool,
  TbStack2,
  TbUser,
  TbX,
} from "react-icons/tb";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

// Order mirrors the page. The ids stay as they are so existing deep links
// (/#skills, /#education) and anything pointing at them keep resolving; only
// the visible labels follow the section titles. Each carries an icon because
// the icon is all that is left once the rail is folded.
const links = [
  { name: "About", href: "#about", Icon: TbUser },
  { name: "Experience", href: "#experience", Icon: TbBriefcase },
  { name: "Projects", href: "#projects", Icon: TbFolders },
  { name: "Stack", href: "#skills", Icon: TbStack2 },
  { name: "Background", href: "#education", Icon: TbSchool },
  { name: "Contact", href: "#contact", Icon: TbMail },
];

const STORAGE_KEY = "rail-collapsed";
const OPEN_WIDTH = "15rem";
const FOLDED_WIDTH = "4.75rem";

const Wordmark = ({ compact = false }) => (
  <a
    href="#home"
    aria-label="Wence Tongol, home"
    className="font-mono text-sm font-semibold tracking-tight text-fg"
  >
    <span className="text-accent">&lt;</span>
    {!compact && "wence"}
    <span className="text-accent"> /&gt;</span>
  </a>
);

/**
 * Navigation. A fixed rail down the left from `lg` up, and a top bar with a
 * drawer below that -- a permanent sidebar on a phone would eat most of the
 * screen, so the small layout keeps the bar it always had.
 *
 * The rail folds to an icon strip. Its width lives in a custom property on the
 * page wrapper rather than as a class on both elements, so the rail and the
 * content column can never disagree about how wide it currently is, and the
 * page slides rather than snaps when it changes.
 */
const SideNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [folded, setFolded] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Private mode and blocked site data both throw here. Default to open.
      return false;
    }
  });

  // Publish the rail width to the page wrapper, and remember the choice.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--rail",
      folded ? FOLDED_WIDTH : OPEN_WIDTH,
    );
    try {
      localStorage.setItem(STORAGE_KEY, folded ? "1" : "0");
    } catch {
      // Not being able to remember the preference is not worth failing over.
    }
  }, [folded]);

  const toggleFold = useCallback(() => setFolded((value) => !value), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section is currently under the reading line.
  //
  // An IntersectionObserver only reports sections whose visibility *changed*,
  // so scrolling back up fired a callback containing just the section that left
  // the band -- nothing was marked intersecting, no update happened, and the
  // marker stayed stuck on the section below. Measuring positions on scroll
  // resolves to exactly one section every frame instead.
  useEffect(() => {
    let frame = null;

    const measure = () => {
      frame = null;
      // Resolved every pass, not cached at mount: the sections below the fold
      // are lazy, so most of them do not exist yet when this first runs.
      const sections = links
        .map((link) => ({
          href: link.href,
          el: document.querySelector(link.href),
        }))
        .filter((section) => section.el);
      if (sections.length === 0) return;

      const line = 96;
      const last = sections[sections.length - 1];
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      let current = "";
      for (const section of sections) {
        if (section.el.getBoundingClientRect().top <= line)
          current = section.href;
      }

      // A short final section may never reach the line; the footer counts as it.
      setActive(atBottom && last ? last.href : current);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {/* The rail. */}
      <aside
        style={{ width: folded ? FOLDED_WIDTH : OPEN_WIDTH }}
        className="fixed top-0 left-0 z-50 hidden h-dvh flex-col border-r border-line bg-canvas/70 backdrop-blur-md transition-[width] duration-300 motion-reduce:transition-none lg:flex"
      >
        {/* Wordmark and the fold control, together, at the top in both states.
            The expand button used to move to the bottom once folded, which put
            it nowhere near the control that sent it there. */}
        <div
          className={`flex shrink-0 ${
            folded
              ? "flex-col items-center gap-4 px-3 pt-6 pb-2"
              : "h-20 items-center justify-between px-6"
          }`}
        >
          <Wordmark compact={folded} />
          <button
            type="button"
            onClick={toggleFold}
            aria-label={folded ? "Expand navigation" : "Collapse navigation"}
            aria-expanded={folded ? "false" : "true"}
            className="pressable grid h-8 w-8 place-items-center rounded-lg text-faint transition-colors hover:bg-surface-2 hover:text-accent"
          >
            {folded ? (
              <TbLayoutSidebarLeftExpand size={17} />
            ) : (
              <TbLayoutSidebarLeftCollapse size={17} />
            )}
          </button>
        </div>

        <nav aria-label="Sections" className="mt-2 min-h-0 flex-1 px-3">
          <ul className="space-y-1">
            {links.map((link) => {
              const current = active === link.href;
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    aria-current={current ? "true" : undefined}
                    className={`group relative flex items-center rounded-lg py-2.5 font-mono text-[13px] transition-colors ${
                      folded ? "justify-center px-0" : "gap-3 px-3"
                    } ${
                      current
                        ? "text-accent"
                        : "text-muted hover:bg-surface-2 hover:text-fg"
                    }`}
                  >
                    {/* Shared layoutId lets the marker glide between items
                        instead of disappearing and reappearing. */}
                    {current && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-accent-soft"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <link.Icon
                      size={17}
                      aria-hidden="true"
                      className="relative shrink-0"
                    />
                    {/* Kept in the tree when folded, so the link still has an
                        accessible name rather than relying on a title. */}
                    <span className={folded ? "sr-only" : "relative truncate"}>
                      {link.name}
                    </span>

                    {/* Folded, the label has nowhere to sit, so it appears
                        beside the rail on hover. Pointer-events off so it can
                        never swallow the click it is describing. */}
                    {folded && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-full z-10 ml-3 rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-xs whitespace-nowrap text-fg opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
                      >
                        {link.name}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* The theme toggle is all that lives down here now. */}
        <div
          className={`flex shrink-0 items-center border-t border-line py-4 ${
            folded ? "justify-center px-3" : "px-6"
          }`}
        >
          <ThemeToggle />
        </div>
      </aside>

      {/* Small screens keep a bar. */}
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 lg:hidden ${
          scrolled
            ? "border-b border-line bg-canvas/80 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <nav className="flex h-16 items-center justify-between px-6">
          <Wordmark />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="card-edge pressable grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-fg"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? <TbX size={16} /> : <TbMenu2 size={16} />}
            </button>
          </div>
        </nav>

        {open && (
          <ul className="border-b border-line bg-canvas/95 px-6 pb-4 font-mono text-sm text-muted backdrop-blur-md">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2 transition-colors hover:text-accent"
                >
                  <link.Icon size={16} aria-hidden="true" />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>
    </>
  );
};

export default SideNav;
