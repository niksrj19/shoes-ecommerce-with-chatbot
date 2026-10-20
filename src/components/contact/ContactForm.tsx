"use client";

import { FormEvent, useState } from "react";
import { ContactService } from "@/services/contact.service";

function ContactIcon({ path }: { path: string }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | null
  >(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const orderNumber = String(formData.get("orderNumber") ?? "").trim();

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      topic: String(formData.get("topic") ?? ""),
      ...(orderNumber ? { orderNumber } : {}),
      message: String(formData.get("message") ?? "").trim(),
    };

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      await ContactService.submitMessage(payload);
      form.reset();
      setSubmissionStatus("success");
    } catch {
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF0055] focus:bg-white focus:ring-4 focus:ring-[#FF0055]/10 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Alex Morgan"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF0055] focus:bg-white focus:ring-4 focus:ring-[#FF0055]/10 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="alex@example.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-topic"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            What can we help with?
          </label>
          <select
            id="contact-topic"
            name="topic"
            defaultValue=""
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#FF0055] focus:bg-white focus:ring-4 focus:ring-[#FF0055]/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="" disabled>
              Choose a topic
            </option>
            <option value="Order Issue">Order Issue</option>
            <option value="Shipping & Delivery">Shipping &amp; Delivery</option>
            <option value="Returns & Refunds">Returns &amp; Refunds</option>
            <option value="Product Question">Product Question</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="contact-order"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Order number{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="contact-order"
            name="orderNumber"
            type="text"
            autoComplete="off"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF0055] focus:bg-white focus:ring-4 focus:ring-[#FF0055]/10 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="e.g. BS-12345"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          disabled={isSubmitting}
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF0055] focus:bg-white focus:ring-4 focus:ring-[#FF0055]/10 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Tell us a little about how we can help..."
        />
      </div>

      {submissionStatus === "success" && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          Your message has been sent. Our team will get back to you by email.
        </p>
      )}
      {submissionStatus === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          We couldn’t send your message. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF0055] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF0055]/20 transition hover:bg-[#e6004d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF0055] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Sending..." : "Send message"}
        {!isSubmitting && (
          <ContactIcon path="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
        )}
      </button>
      <p className="text-xs leading-5 text-slate-500">
        Your message will be sent securely to the BaseSole support team.
      </p>
    </form>
  );
}
