"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroChart } from "@/components/landing/HeroChart";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  const faqKeys = [
    "cost",
    "worthIt",
    "howMuchPower",
    "noRegistration",
    "accuracy",
  ] as const;

  const stepKeys = ["01", "02", "03"] as const;
  const forWhomKeys = ["homeowner", "consultant", "researcher"] as const;
  const privacyKeys = ["cookies", "tracker", "signup", "local"] as const;

  return (
    <div className="bg-paper text-ink">
      <JsonLd />

      {/* HERO ————————————————————————————————— */}
      <section className="rule-b">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 pt-8 md:pt-10 pb-10 md:pb-14">
          <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
            <div className="md:col-span-5">
              <div className="small-caps text-[11px] text-muted-ink mb-4">
                {t("landing.eyebrow")}
              </div>
              <h1 className="font-display text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.02] tracking-tight text-ink">
                {t("landing.headline")}
                <br />
                <span className="text-solar">{t("landing.headlineAccent")}</span>
              </h1>
              <p className="mt-5 text-[15.5px] md:text-[16.5px] leading-[1.55] text-muted-ink max-w-[46ch]">
                {t("landing.lede")}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/konfigurator" className="btn-primary">
                  {t("landing.primaryCta")}
                  <span className="font-mono-ui text-[11px] opacity-60">→</span>
                </Link>
                <Link href="/methodik" className="btn-ghost">
                  {t("landing.secondaryCta")}
                </Link>
              </div>

              <div className="mt-6 pt-5 border-t border-rule flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[12.5px]">
                <div className="flex items-baseline gap-2">
                  <span className="small-caps text-[10.5px] text-faint-ink">
                    {t("landing.ledger.sources")}
                  </span>
                  <span className="text-muted-ink font-mono-ui text-[11px]">
                    {t("landing.ledger.sourcesList")}
                  </span>
                </div>
                <Link
                  href="/methodik"
                  className="text-muted-ink hover:text-ink underline underline-offset-4 decoration-rule"
                >
                  {t("landing.ledger.methodology")} →
                </Link>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="p-4 md:p-6 bg-paper border border-rule">
                <HeroChart />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY LEDGER ————————————————————————————————— */}
      <section className="rule-b bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-7">
            <h2 className="font-display text-[24px] md:text-[30px] tracking-tight">
              {t("landing.privacy.title")}
            </h2>
            <p className="text-[13.5px] text-muted-ink max-w-[52ch] leading-relaxed">
              {t("landing.privacy.caption")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 border border-rule">
            {privacyKeys.map((key, i) => (
              <div
                key={key}
                className={`p-5 md:p-7 ${
                  i < privacyKeys.length - 1 ? "md:border-r" : ""
                } ${i < 2 ? "border-b md:border-b-0" : ""} ${
                  i === 0 ? "border-r" : ""
                } ${i === 2 ? "border-r md:border-r" : ""} border-rule`}
              >
                <div className="font-num text-[52px] md:text-[64px] leading-none text-ink">
                  {t(`landing.privacy.items.${key}.value`)}
                </div>
                <div className="mt-3 text-[12.5px] text-muted-ink">
                  {t(`landing.privacy.items.${key}.label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS ————————————————————————————————— */}
      <section className="rule-b bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <div className="small-caps text-[11px] text-faint-ink mb-3">
                {t("landing.ledger.methodology")}
              </div>
              <h2 className="font-display text-[28px] md:text-[34px] leading-[1.1] tracking-tight">
                {t("landing.how.title")}
              </h2>
              <p className="mt-4 text-[15.5px] text-muted-ink leading-[1.55] max-w-[38ch]">
                {t("landing.how.intro")}
              </p>
            </div>

            <div className="md:col-span-8 md:border-l border-rule md:pl-10">
              {stepKeys.map((k, i) => (
                <article
                  key={k}
                  className={`py-6 md:py-7 ${
                    i < stepKeys.length - 1 ? "rule-b" : ""
                  } ${i === 0 ? "md:pt-0" : ""}`}
                >
                  <div className="grid md:grid-cols-12 gap-5 items-baseline">
                    <div className="md:col-span-2 flex items-baseline gap-3">
                      <span className="font-num text-[13px] text-faint-ink">
                        {k}
                      </span>
                      <span className="text-[12px] text-muted-ink">
                        {t(`landing.how.steps.${k}.label`)}
                      </span>
                    </div>
                    <div className="md:col-span-10">
                      <h3 className="font-display text-[19px] md:text-[21px] tracking-tight text-ink">
                        {t(`landing.how.steps.${k}.title`)}
                      </h3>
                      <p className="mt-1.5 text-[14.5px] text-muted-ink leading-[1.6] max-w-[60ch]">
                        {t(`landing.how.steps.${k}.body`)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOR WHOM ————————————————————————————————— */}
      <section className="rule-b bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-12 md:py-16">
          <h2 className="font-display text-[24px] md:text-[30px] tracking-tight mb-6">
            {t("landing.forWhom.title")}
          </h2>
          <div className="border-t border-b border-rule">
            {forWhomKeys.map((key, i) => (
              <div
                key={key}
                className={`grid md:grid-cols-12 gap-4 py-4 md:py-5 items-baseline ${
                  i < forWhomKeys.length - 1 ? "rule-b" : ""
                }`}
              >
                <div className="md:col-span-1 font-num text-[11px] text-faint-ink">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="md:col-span-5 font-display text-[16px] md:text-[18px] text-ink">
                  {t(`landing.forWhom.rows.${key}.who`)}
                </div>
                <div className="md:col-span-6 text-[14.5px] text-muted-ink leading-[1.5]">
                  {t(`landing.forWhom.rows.${key}.use`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ————————————————————————————————— */}
      <section className="rule-b bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <div className="small-caps text-[11px] text-faint-ink mb-3">
                FAQ
              </div>
              <h2 className="font-display text-[28px] md:text-[34px] leading-[1.1] tracking-tight">
                {t("landing.faqTitle")}
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="border-t border-rule">
                {faqKeys.map((key, i) => (
                  <FaqItem
                    key={key}
                    index={i + 1}
                    question={t(`faq.items.${key}.question`)}
                    answer={t(`faq.items.${key}.answer`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA ————————————————————————————————— */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-tight">
                {t("landing.finalCta.title")}
              </h2>
              <p className="mt-3 text-[15.5px] md:text-[16.5px] text-[color:var(--faint-ink)] leading-[1.55] max-w-[56ch]">
                {t("landing.finalCta.subtitle")}
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                href="/konfigurator"
                className="inline-flex items-center gap-3 px-5 py-3.5 bg-paper text-ink hover:bg-[color:var(--accent-solar)] hover:text-paper transition-colors border border-paper"
              >
                <span className="text-[15px] font-medium">
                  {t("landing.finalCta.action")}
                </span>
                <span className="font-mono-ui text-[11px] opacity-60">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqItem({
  index,
  question,
  answer,
}: {
  index: number;
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rule-b">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-baseline gap-5 py-4 md:py-5 text-left hover:bg-secondary/40 transition-colors px-1"
      >
        <span className="font-num text-[11px] text-faint-ink w-6 shrink-0">
          {String(index).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-[16px] md:text-[18px] tracking-tight text-ink">
          {question}
        </span>
        <span className="text-muted-ink shrink-0">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      {open && (
        <div className="pl-12 pr-2 pb-5 text-[14.5px] text-muted-ink leading-[1.6] max-w-[64ch]">
          {answer}
        </div>
      )}
    </div>
  );
}
