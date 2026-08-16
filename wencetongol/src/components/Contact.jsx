import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import {
  FiAlertCircle,
  FiCheck,
  FiCornerUpLeft,
  FiLoader,
  FiMapPin,
  FiSend,
} from "react-icons/fi";
import Section from "./Section";
import PhilippinesMap from "./PhilippinesMap";

const details = [
  {
    icon: <HiOutlineMail />,
    label: "tongolwey@gmail.com",
    href: "mailto:tongolwey@gmail.com",
  },
  { icon: <FiMapPin />, label: "Pampanga, Philippines", href: null },
];

const socials = [
  { icon: <FaGithub />, href: "https://github.com/codew3y/", label: "GitHub" },
  {
    icon: <FaLinkedinIn />,
    href: "https://www.linkedin.com/in/wence-tongol-32a968393/",
    label: "LinkedIn",
  },
  {
    icon: <FaFacebookF />,
    href: "https://www.facebook.com/share/1AKQEk1AEq/?mibextid=wwXIfr/",
    label: "Facebook",
  },
];

// Mirrors the limits api/contact.js enforces, so the browser stops you before a
// pointless round trip rather than after one.
const MAX_LENGTH = { name: 100, email: 200, subject: 150, message: 5000 };

const fieldClass =
  "w-full rounded-lg border border-line bg-canvas-2 px-4 py-3 text-sm text-fg placeholder-faint transition-colors hover:border-line-strong focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
  "mb-2 block font-mono text-[11px] tracking-[0.15em] text-faint uppercase";

const Field = ({ id, label, required, children }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
      {required && <span className="ml-1 text-accent">*</span>}
    </label>
    {children}
  </div>
);

const Contact = () => {
  // idle -> sending -> sent | error. The form posts to /api/contact rather than
  // navigating away, so the visitor never leaves the page.
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [typed, setTyped] = useState(0);

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "The message could not be sent.");
      }

      form.reset();
      setTyped(0);
      setStatus("sent");
    } catch (cause) {
      setError(cause.message);
      setStatus("error");
    }
  };

  const sending = status === "sending";
  const nearLimit = typed > MAX_LENGTH.message * 0.9;

  return (
    <Section
      id="contact"
      label="contact"
      title="Get in touch"
      intro="Have a question or an opportunity? Send a message and I'll get back to you."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative min-h-[420px]"
        >
          {/* Archipelago behind the details and social links, in the same
              accent as the rest of the page but dialled down to a watermark.
              -top-10 reaches back over the section's mt-10 gap so the map
              starts right under the intro line; the column stretches with the
              grid row, so bottom-0 lands on the form's bottom edge.

              Light mode needs about twice the opacity: dark teal on a near-white
              canvas carries far less contrast than bright cyan does on black. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 right-0 bottom-0 left-0 text-accent opacity-50 dark:opacity-[0.22]"
          >
            <PhilippinesMap className="h-full w-full" />
          </div>

          <div className="relative space-y-4">
            {details.map((detail) => {
              const content = (
                <span className="flex items-center gap-3">
                  <span className="text-lg text-accent">{detail.icon}</span>
                  <span className="font-mono text-sm">{detail.label}</span>
                </span>
              );

              return detail.href ? (
                <a
                  key={detail.label}
                  href={detail.href}
                  className="block text-muted transition-colors hover:text-accent"
                >
                  {content}
                </a>
              ) : (
                <div key={detail.label} className="text-muted">
                  {content}
                </div>
              );
            })}

            <div className="flex gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-line bg-surface"
        >
          {/* Card header echoes the section headers: mono label, hairline rule. */}
          <div className="flex items-center gap-4 border-b border-line px-6 py-4 md:px-8">
            <p className="font-mono text-xs tracking-[0.2em] text-accent">
              send a message
            </p>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-4 py-10 text-center"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-accent-soft text-xl text-accent">
                    <FiCheck />
                  </span>
                  <div>
                    <p className="font-semibold text-fg">Message sent</p>
                    <p className="mt-1 text-sm text-muted">
                      Thanks for reaching out — I'll reply to the address you
                      gave me.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <FiCornerUpLeft />
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={onSubmit}
                  className="flex flex-col gap-5"
                >
                  {/* Honeypot: hidden from people, irresistible to bots.
                      Anything typed here means the submission is discarded
                      server-side. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label="Name" required>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Juan Dela Cruz"
                        autoComplete="name"
                        maxLength={MAX_LENGTH.name}
                        required
                        disabled={sending}
                        className={fieldClass}
                      />
                    </Field>

                    <Field id="email" label="Email" required>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        maxLength={MAX_LENGTH.email}
                        required
                        disabled={sending}
                        className={fieldClass}
                      />
                    </Field>
                  </div>

                  <Field id="subject" label="Subject">
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      placeholder="What is this about?"
                      maxLength={MAX_LENGTH.subject}
                      disabled={sending}
                      className={fieldClass}
                    />
                  </Field>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="message" className={labelClass}>
                        Message
                        <span className="ml-1 text-accent">*</span>
                      </label>
                      <span
                        aria-hidden="true"
                        className={`font-mono text-[11px] ${
                          nearLimit ? "text-accent" : "text-faint"
                        }`}
                      >
                        {typed}/{MAX_LENGTH.message}
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Tell me a bit about what you need."
                      maxLength={MAX_LENGTH.message}
                      required
                      disabled={sending}
                      onChange={(event) => setTyped(event.target.value.length)}
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-400"
                    >
                      <FiAlertCircle className="mt-0.5 shrink-0" />
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={sending}
                      className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sending ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          <FiSend className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                          Send message
                        </>
                      )}
                    </button>

                    <p className="font-mono text-[11px] text-faint">
                      Replies go to the address you enter.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Contact;
