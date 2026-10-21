import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  Mail,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const supportEmail = "support@basesole.online";

export const metadata: Metadata = {
  title: "Returns & Refunds | BaseSole",
  description:
    "Learn how to request a return or exchange and what to expect from your BaseSole refund.",
};

const returnSteps = [
  {
    title: "Contact our team",
    description:
      "Email us within 7 days of delivery with your order number and the item you’d like to return or exchange.",
  },
  {
    title: "Follow the return instructions",
    description:
      "We’ll confirm eligibility and share the next steps before you send anything back.",
  },
  {
    title: "We review your item",
    description:
      "After it arrives, our team checks the item and gets in touch about the approved return or exchange.",
  },
];

const eligibilityItems = [
  "Contact us within 7 days of the delivery date.",
  "Items must be unworn, unused, and in their original condition.",
  "Include the original shoe box, tags, and any accessories that came with your order.",
  "Please wait for return instructions from our team before shipping an item back.",
];

const faqs = [
  {
    question: "How do I start a return or exchange?",
    answer:
      "Email support@basesole.online with your order number and the item you want to return or exchange. Our team will confirm the next steps.",
  },
  {
    question: "When will I receive my refund?",
    answer:
      "Once we receive and inspect your return, we’ll confirm the outcome and process any approved refund to your original payment method where available. Your bank or payment provider may need additional time to display it.",
  },
  {
    question: "Can I exchange my order instead?",
    answer:
      "Yes, you can ask for an exchange within 7 days of delivery. Exchanges are subject to item and size availability; our team will confirm your options.",
  },
  {
    question: "What if my order arrived damaged or incorrect?",
    answer:
      "Contact us as soon as you can with your order number and a brief description of the issue. Photos can help our team assess it and guide you.",
  },
];

function PolicyIcon({
  icon: Icon,
  className = "h-5 w-5",
}: {
  icon: typeof RotateCcw;
  className?: string;
}) {
  return <Icon aria-hidden="true" className={className} strokeWidth={1.8} />;
}

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-full bg-[#FBFBFC] text-slate-900">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <section className="relative overflow-hidden rounded-3xl bg-[#09101D] px-6 py-9 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#FF0055]/20 blur-3xl"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF8DB1]">
                BaseSole care guide
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Returns &amp; refunds
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                The right pair should feel right. If it doesn’t, our team is
                here to help you with a return or exchange.
              </p>
            </div>

            <div className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5 lg:w-64">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF0055]/15 text-[#FF8DB1]">
                <PolicyIcon icon={Clock3} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-2xl font-extrabold tracking-tight">7 days</p>
                <p className="mt-0.5 text-sm text-slate-300">from delivery</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5] text-[#FF0055]">
              <PolicyIcon icon={RotateCcw} className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold tracking-tight text-[#09101D] sm:text-2xl">
              Start a return or exchange
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Get in touch within 7 days of delivery. Include your order number
              so we can find your purchase and help you faster.
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FF0055] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e6004d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF0055] sm:w-auto"
            >
              <PolicyIcon icon={Mail} className="h-4 w-4" />
              Email support
              <PolicyIcon icon={ArrowRight} className="h-4 w-4" />
            </a>
            <p className="mt-3 break-all text-xs text-slate-500">
              {supportEmail}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-[#09101D] sm:text-2xl">
              How it works
            </h2>
            <ol className="mt-6 space-y-5">
              {returnSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <PolicyIcon icon={ShieldCheck} />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-[#09101D] sm:text-xl">
                Return eligibility
              </h2>
            </div>
            <ul className="mt-5 space-y-3">
              {eligibilityItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <PolicyIcon
                    icon={Check}
                    className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F5] text-[#FF0055]">
                <PolicyIcon icon={PackageCheck} />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-[#09101D] sm:text-xl">
                Refunds &amp; exchanges
              </h2>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              After your return arrives, we’ll inspect the item and let you know
              the outcome. Approved refunds are sent to the original payment
              method where available. Your bank or payment provider may take
              additional time to show the funds.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Need an exchange? Tell us the size or item you’re looking for.
              We’ll confirm availability and share the next steps.
            </p>
          </div>
        </section>

        <section className="mt-10 sm:mt-12">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF0055]">
                Good to know
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#09101D] sm:text-3xl">
                Frequently asked questions
              </h2>
            </div>
            <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-bold text-slate-900 marker:hidden">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="text-lg font-normal text-[#FF0055] transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-6 text-sm leading-6 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 rounded-3xl bg-[#09101D] p-6 text-white sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">
              Still have a question?
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Our support team is happy to help with your order.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View my orders
              <PolicyIcon icon={ArrowRight} className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#09101D] transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PolicyIcon icon={Mail} className="h-4 w-4" />
              Contact support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
