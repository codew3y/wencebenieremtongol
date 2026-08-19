import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiSend, FiX } from "react-icons/fi";
import useDialog from "../hooks/useDialog";

/**
 * Asks api/chat.js about the site's own content.
 *
 * The endpoint runs on a free tier metered in requests rather than dollars, so
 * running out is a normal state here, not an error state: every failure ends in
 * a sentence that points at the résumé and the contact form, because a visitor
 * who came to read about the work should never be left holding a dead box.
 */

const SUGGESTIONS = [
  "What does he do at Manentia?",
  "Tell me about the MCP connectors",
  "What's his experience with Zoho?",
];

// Keyed off the endpoint's `reason` so the copy can stay specific.
const FALLBACKS = {
  "rate-limited": "You've asked a fair few in the last hour — give it a bit.",
  quota:
    "The assistant has used up today's free allowance. The projects and résumé above cover the same ground, and the contact form always works.",
  unconfigured: "The assistant isn't switched on yet — try the contact form.",
  upstream:
    "The assistant is having a moment. The projects section and résumé cover the same ground.",
  empty: "That one didn't land. Try asking it a different way.",
  offline: "That didn't reach the server — check your connection and try again.",
};

const AskDialog = ({ open, onClose }) => {
  const panelRef = useDialog(open, onClose);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState(null);
  const threadRef = useRef(null);
  const inputRef = useRef(null);

  // Land on the newest message rather than the top of the thread.
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages, pending, failure]);

  useEffect(() => {
    if (!open) return;
    setFailure(null);
    // After the dialog's own focus move, so it does not fight useDialog.
    const focus = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(focus);
  }, [open]);

  const send = async (question) => {
    const text = question.trim();
    if (text.length === 0 || pending) return;

    const thread = [...messages, { role: "user", content: text }];
    setMessages(thread);
    setDraft("");
    setFailure(null);
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: thread }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFailure(
          FALLBACKS[payload.reason] ?? payload.error ?? FALLBACKS.upstream,
        );
        return;
      }

      // A 200 carrying no answer means something upstream of here is wrong --
      // in dev it is the SPA fallback returning index.html for /api/chat. Either
      // way, an empty bubble is worse than saying so.
      const answer = String(payload.answer ?? "").trim();
      if (answer.length === 0) {
        setFailure(FALLBACKS.upstream);
        return;
      }

      setMessages([...thread, { role: "assistant", content: answer }]);
    } catch {
      setFailure(FALLBACKS.offline);
    } finally {
      setPending(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[85] flex items-end justify-center bg-canvas/85 p-4 backdrop-blur-sm sm:items-center md:p-8"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ask-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="flex h-[70vh] max-h-[640px] w-full max-w-2xl min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/20 focus:outline-none"
          >
            <div className="flex items-center gap-3 border-b border-line bg-canvas-2 px-4 py-3 md:px-5">
              <p
                id="ask-title"
                className="font-mono text-xs tracking-[0.2em] text-accent"
              >
                ask about my work
              </p>
              <span className="h-px flex-1 bg-line" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close assistant"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <FiX />
              </button>
            </div>

            <div
              ref={threadRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 md:p-5"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted">
                    Ask about the projects, the stack, or the experience. It
                    answers from this site only — for anything else, the contact
                    form is the way.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => send(suggestion)}
                        className="rounded-lg border border-line bg-canvas-2 px-3 py-1.5 text-left text-[13px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={`${index}-${message.content.slice(0, 24)}`}
                  className={
                    message.role === "user" ? "flex justify-end" : "flex"
                  }
                >
                  <p
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-accent-soft text-fg"
                        : "border border-line bg-canvas-2 text-muted"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              ))}

              {pending && (
                <p className="font-mono text-xs tracking-[0.2em] text-faint">
                  thinking…
                </p>
              )}

              {failure && (
                <p className="rounded-xl border border-line bg-canvas-2 px-3.5 py-2.5 text-sm leading-relaxed text-muted">
                  {failure}
                </p>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                send(draft);
              }}
              className="flex shrink-0 items-center gap-2 border-t border-line bg-canvas-2 p-3 md:px-4"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={500}
                placeholder="Ask a question…"
                aria-label="Ask a question about Wence's work"
                // text-base below sm: iOS Safari zooms the page when a focused input
                // is under 16px, and the dialog never zooms back out.
                className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-fg placeholder:text-faint focus:border-accent/60 focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                disabled={pending || draft.trim().length === 0}
                aria-label="Send question"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <FiSend size={15} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default AskDialog;
