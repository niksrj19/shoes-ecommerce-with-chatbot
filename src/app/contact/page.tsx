import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

const supportEmail = "support@basesole.online";

export const metadata: Metadata = {
  title: "Contact Us | BaseSole",
  description: "Get in touch with the BaseSole team for help with your order, sizing, or anything else.",
};

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

export default function ContactPage() {
  return (
    <div className="min-h-full bg-[#FBFBFC] text-slate-900">
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF0055]">
            We’re listening
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#09101D] sm:text-5xl">
            Contact us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Need a hand with an order, finding the right fit, or anything else?
            Send us a message and our team will be happy to help.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:mt-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          <section className="relative overflow-hidden rounded-3xl bg-[#09101D] p-6 text-white sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF0055]/20 blur-3xl"
            />
            <div className="relative">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FF5C91]">
                <ContactIcon path="M4 6h16v12H4zM4 7l8 6 8-6" />
              </span>
              <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Let’s talk sneakers.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
                Whether it’s a question about your latest pair or help choosing
                your next one, drop us a line.
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Email our team
                </p>
                <a
                  href={`mailto:${supportEmail}`}
                  className="mt-3 inline-flex max-w-full items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:text-[#FF8DB1] hover:decoration-[#FF8DB1] sm:text-base"
                >
                  <span className="break-all">{supportEmail}</span>
                  <ContactIcon path="M7 17 17 7M7 7h10v10" />
                </a>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Prefer email? Write to us directly and our support team will
                  be happy to help.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="text-sm font-semibold text-white">
                  Need help with an order?
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Include your order number in your message so we can point you
                  in the right direction.
                </p>
                <Link
                  href="/orders"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF8DB1] transition hover:text-white"
                >
                  View your orders
                  <ContactIcon path="M7 17 17 7M7 7h10v10" />
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
            <div className="mb-7">
              <h2 className="text-xl font-bold tracking-tight text-[#09101D] sm:text-2xl">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in the details below and we’ll get back to you by email.
              </p>
            </div>

            <ContactForm />
          </section>
        </div>
      </main>
    </div>
  );
}
