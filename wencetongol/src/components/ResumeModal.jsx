import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiDownload, FiExternalLink, FiX } from "react-icons/fi";
import CVResume from "../assets/CV/WenceTongol_Resume.pdf";
import useDialog from "../hooks/useDialog";

const FILE_NAME = "WenceTongol_Resume.pdf";

/**
 * Reads the resume in place, so nobody has to download a file to decide whether
 * to keep reading. Download and open-in-tab stay available, because plenty of
 * mobile browsers refuse to render a PDF in an iframe — the noscript-ish
 * fallback inside the frame covers that case.
 */
const ResumeModal = ({ open, onClose }) => {
  const panelRef = useDialog(open, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-canvas/80 p-4 backdrop-blur-sm md:p-8"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            // Clicks inside must not reach the backdrop's close handler.
            onClick={(event) => event.stopPropagation()}
            className="flex h-full max-h-[900px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/20 focus:outline-none"
          >
            <div className="flex items-center gap-3 border-b border-line bg-canvas-2 px-4 py-3 md:px-5">
              <p
                id="resume-title"
                className="font-mono text-xs tracking-[0.2em] text-accent"
              >
                <span className="text-faint">//</span> résumé
              </p>
              <span className="h-px flex-1 bg-line" />

              <a
                href={CVResume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <FiExternalLink />
                <span className="hidden sm:inline">New tab</span>
              </a>
              <a
                href={CVResume}
                download={FILE_NAME}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 font-mono text-[11px] font-semibold text-accent-fg transition-opacity hover:opacity-90"
              >
                <FiDownload />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close résumé"
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <FiX />
              </button>
            </div>

            <div className="min-h-0 flex-1 bg-canvas-2">
              <iframe
                src={`${CVResume}#view=FitH`}
                title="Résumé — Wence Benierem Tongol"
                className="h-full w-full"
              >
                {/* Shown only where inline PDFs are unsupported. */}
                <p className="p-6 text-sm text-muted">
                  Your browser can't display the PDF here.{" "}
                  <a
                    href={CVResume}
                    download={FILE_NAME}
                    className="text-accent"
                  >
                    Download it instead
                  </a>
                  .
                </p>
              </iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ResumeModal;
