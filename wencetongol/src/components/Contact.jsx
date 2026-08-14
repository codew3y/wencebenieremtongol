import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
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

const fieldClass =
  "w-full rounded-lg border border-line bg-canvas-2 px-4 py-2.5 text-sm text-fg placeholder-faint transition-colors focus:border-accent focus:outline-none disabled:opacity-60";

const Contact = () => {
  // idle -> sending -> sent | error. The form posts to /api/contact rather than
  // navigating away, so the visitor never leaves the page.
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

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
      setStatus("sent");
    } catch (cause) {
      setError(cause.message);
      setStatus("error");
    }
  };

  const sending = status === "sending";

  return (
    <Section
      id="contact"
      index="06"
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

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6"
        >
          {/* Honeypot: hidden from people, irresistible to bots. Anything typed
              here means the submission is discarded server-side. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="sr-only">
                Your name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                required
                disabled={sending}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Your email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your email"
                required
                disabled={sending}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="sr-only">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              placeholder="Subject"
              disabled={sending}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Your message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Your message"
              required
              disabled={sending}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send message"}
            </button>

            <p
              role="status"
              aria-live="polite"
              className={`text-sm ${status === "error" ? "text-red-400" : "text-accent"}`}
            >
              {status === "sent" && "Thanks — your message is on its way."}
              {status === "error" && error}
            </p>
          </div>
        </motion.form>
      </div>
    </Section>
  );
};

export default Contact;
