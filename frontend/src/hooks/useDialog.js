import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Modal plumbing: scroll lock, Escape to close, focus moved in and returned,
 * and Tab kept inside the panel.
 *
 * onClose is held in a ref rather than being an effect dependency. Callers
 * almost always pass an inline arrow function, so depending on it would tear
 * down and re-run this effect on every parent render -- and the cleanup returns
 * focus to the trigger, so an open dialog would keep losing focus while
 * anything above it re-rendered (Home re-renders on every typewriter tick).
 *
 * Returns a ref to attach to the panel element.
 */
const useDialog = (open, onClose) => {
  const panelRef = useRef(null);
  const returnFocusTo = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    returnFocusTo.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && active === last) {
        first.focus();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      returnFocusTo.current?.focus?.();
    };
  }, [open]);

  return panelRef;
};

export default useDialog;
