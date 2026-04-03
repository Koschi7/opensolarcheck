"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sun,
  ShieldCheck,
  Code2,
  Monitor,
  ArrowRight,
  Zap,
  TrendingUp,
  Leaf,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { useState } from "react";

export default function HomePage() {
  const t = useTranslations();

  const features = [
    { icon: Sun, label: t("hero.features.free"), color: "text-amber-500" },
    {
      icon: ShieldCheck,
      label: t("hero.features.noData"),
      color: "text-blue-600",
    },
    {
      icon: Code2,
      label: t("hero.features.openSource"),
      color: "text-green-600",
    },
    {
      icon: Monitor,
      label: t("hero.features.clientSide"),
      color: "text-purple-600",
    },
  ];

  const highlights = [
    {
      icon: Zap,
      title: t("hero.highlights.yield.title"),
      description: t("hero.highlights.yield.description"),
    },
    {
      icon: TrendingUp,
      title: t("hero.highlights.economics.title"),
      description: t("hero.highlights.economics.description"),
    },
    {
      icon: Leaf,
      title: t("hero.highlights.co2.title"),
      description: t("hero.highlights.co2.description"),
    },
  ];

  const faqKeys = ["cost", "worthIt", "howMuchPower", "noRegistration", "accuracy"] as const;

  return (
    <div>
      <JsonLd />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-gray-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-amber-100 p-4">
                <Sun className="h-12 w-12 text-amber-500" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mb-8 text-lg text-gray-600 md:text-xl">
              {t("hero.subtitle")}
            </p>
            <Link href="/konfigurator">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Feature badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border"
              >
                <f.icon className={`h-4 w-4 ${f.color}`} />
                <span className="text-sm font-medium text-gray-700">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((h) => (
              <Card key={h.title} className="border-0 shadow-md">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 rounded-xl bg-amber-50 p-3">
                    <h.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    {h.title}
                  </h2>
                  <p className="text-sm text-gray-600">{h.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            {t("faq.title")}
          </h2>
          <div className="space-y-3">
            {faqKeys.map((key) => (
              <FaqItem
                key={key}
                question={t(`faq.items.${key}.question`)}
                answer={t(`faq.items.${key}.answer`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {t("hero.title")}
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <Link href="/konfigurator">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {t("hero.cta")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
