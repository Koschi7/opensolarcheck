"use client";

import { useTranslations } from "next-intl";
import type { CalculationResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Zap, Home, Clock, PiggyBank } from "lucide-react";

interface Props {
  result: CalculationResult;
}

export function ResultSummary({ result }: Props) {
  const t = useTranslations("results.summary");

  const cards = [
    {
      icon: Sun,
      label: t("annualYield"),
      value: result.yield.annualYield.toLocaleString("de-DE"),
      unit: "kWh",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: Zap,
      label: t("selfConsumption"),
      value: Math.round(result.selfConsumption.selfConsumptionRatio * 100),
      unit: "%",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      icon: Home,
      label: t("autarky"),
      value: Math.round(result.selfConsumption.autarkyRate * 100),
      unit: "%",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Clock,
      label: t("payback"),
      value: result.economics.paybackYears,
      unit: t("years"),
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      icon: PiggyBank,
      label: t("annualSavings"),
      value: result.economics.annualSavings.toLocaleString("de-DE"),
      unit: "\u20AC",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div
              className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${card.bg}`}
            >
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {card.value}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {card.unit}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
