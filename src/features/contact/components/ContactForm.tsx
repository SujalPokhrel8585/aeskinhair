import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import type { ContactFormData } from "@/types";
import { INITIAL_FORM } from "@/features/contact/data/contactData";
import { validators, buildWhatsAppMessage } from "@/features/contact/validators";
import { WHATSAPP_NUMBER } from "@/constants";
import { openWhatsApp } from "@/lib/whatsapp";

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Feedback & Review",
  "About our Doctors",
  "Services",
  "Collaboration & Partnership",
] as const;

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  }

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    },
    [],
  );

  function getError(field: string): string {
    return (
      validators[field]?.(form[field as keyof ContactFormData] || "") || ""
    );
  }

  const allValid = Object.keys(validators).every((k) => !getError(k));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const allTouched: Record<string, boolean> = {};
    Object.keys(validators).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);

    if (!allValid) {
      setFormError("Please resolve the errors below before submitting.");
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const waMessage = buildWhatsAppMessage(form);
    openWhatsApp(WHATSAPP_NUMBER, waMessage);

    setSubmitting(false);
    setSent(true);
    setForm(INITIAL_FORM);
    setTouched({});
  }

  return (
    <div className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-lg shadow-black/5 w-full">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-10 px-4 flex flex-col items-center justify-center"
          >
            <div className="size-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-4 shadow-xs">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              WhatsApp opened!
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
              We&apos;ve pre-filled your message in WhatsApp, just hit send
              there to reach our team directly.
            </p>
            <button
              onClick={() => setSent(false)}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Send a Message
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Fill out the form below, we&apos;ll open WhatsApp with your
                  message ready to send.
                </p>
              </div>
              <div className="size-10 rounded-full bg-muted text-foreground flex items-center justify-center border border-border shadow-xs">
                <Send className="size-4.5" />
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium mb-5">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                  >
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Shah Rukh Khan"
                    autoComplete="name"
                    required
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all placeholder:text-muted-foreground focus:outline-none dark:[color-scheme:dark] ${
                      touched.name && getError("name")
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                    }`}
                  />
                  {touched.name && getError("name") && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">
                      {getError("name")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                  >
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+977 98xxxxxxxx"
                    autoComplete="tel"
                    required
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all placeholder:text-muted-foreground focus:outline-none dark:[color-scheme:dark] ${
                      touched.phone && getError("phone")
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                    }`}
                  />
                  {touched.phone && getError("phone") && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">
                      {getError("phone")}
                    </p>
                  )}
                </div>
              </div>

              {/* Email – optional (WhatsApp-first: phone is the primary way
                  we reach people back) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Email Address{" "}
                  <span className="text-muted-foreground normal-case tracking-normal font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all placeholder:text-muted-foreground focus:outline-none dark:[color-scheme:dark] ${
                    touched.email && getError("email")
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                  }`}
                />
                {touched.email && getError("email") && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {getError("email")}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="subject"
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Topic / Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-muted border border-black/15 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all cursor-pointer dark:[color-scheme:dark]"
                >
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell us what you have in mind or describe your inquiry..."
                  required
                  className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all resize-none placeholder:text-muted-foreground focus:outline-none dark:[color-scheme:dark] ${
                    touched.message && getError("message")
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "bg-muted border-black/15 dark:border-white/20 focus:ring-2 focus:ring-ring/20 focus:border-ring"
                  }`}
                />
                {touched.message && getError("message") && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {getError("message")}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !allValid}
                className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2
    disabled:bg-primary/40 disabled:text-muted-foreground disabled:shadow-none disabled:hover:bg-primary/40 disabled:cursor-not-allowed disabled:opacity-100
    dark:disabled:text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Opening WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Request via WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
