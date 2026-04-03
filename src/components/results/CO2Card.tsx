"use client";

import { useTranslations } from "next-intl";
import type { CO2Result } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Plane, TreePine } from "lucide-react";

interface Props {
  co2: CO2Result;
}

export function CO2Card({ co2 }: Props) {
  const t = useTranslations("results.co2");

  return (
    <Card className="shadow-md border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-green-800">
          <Leaf className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/70 p-3">
            <p className="text-xs text-gray-500">{t("annual")}</p>
            <p className="text-2xl font-bold text-green-700">
              {co2.annualSavings_kg.toLocaleString("de-DE")}{" "}
              <span className="text-sm font-normal">kg CO2</span>
            </p>
          </div>
          <div className="rounded-lg bg-white/70 p-3">
            <p className="text-xs text-gray-500">{t("lifetime")}</p>
            <p className="text-2xl font-bold text-green-700">
              {co2.lifetimeSavings_tons}{" "}
              <span className="text-sm font-normal">t CO2</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Plane className="h-4 w-4" />
            <span>
              {t("flights", { count: co2.equivalentFlights })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-800">
            <TreePine className="h-4 w-4" />
            <span>
              {t("trees", { count: co2.equivalentTrees })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
