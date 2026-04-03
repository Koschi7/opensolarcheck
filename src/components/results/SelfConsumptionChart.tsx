"use client";

import { useTranslations, useLocale } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { CalculationResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  result: CalculationResult;
}

export function SelfConsumptionChart({ result }: Props) {
  const t = useTranslations("results.charts");
  const locale = useLocale();

  const pvData = [
    {
      name: t("selfConsumptionLabel"),
      value: result.selfConsumption.selfConsumptionKWh,
    },
    { name: t("feedIn"), value: result.selfConsumption.feedInKWh },
  ];

  const consumptionData = [
    {
      name: t("selfSupply"),
      value: result.selfConsumption.selfConsumptionKWh,
    },
    {
      name: t("gridConsumption"),
      value: result.selfConsumption.gridConsumptionKWh,
    },
  ];

  const COLORS_PV = ["#10B981", "#F59E0B"];
  const COLORS_CONSUMPTION = ["#10B981", "#3B82F6"];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{t("selfConsumption")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-center text-sm font-medium text-gray-600 mb-2">
              {t("pvYieldLabel")}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pvData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pvData.map((_, i) => (
                    <Cell key={i} fill={COLORS_PV[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString(locale)} kWh`
                  }
                />
                <Legend fontSize={12} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-center text-sm font-medium text-gray-600 mb-2">
              {t("consumptionLabel")}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={consumptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {consumptionData.map((_, i) => (
                    <Cell key={i} fill={COLORS_CONSUMPTION[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString(locale)} kWh`
                  }
                />
                <Legend fontSize={12} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
