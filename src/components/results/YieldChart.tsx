"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CalculationResult } from "@/lib/types";
import { getMonthlyConsumption } from "@/lib/data/loadProfiles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getMonthNames(locale: string): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i, 1).toLocaleString(locale, { month: "short" })
  );
}

interface Props {
  result: CalculationResult;
  totalConsumption: number;
}

export function YieldChart({ result, totalConsumption }: Props) {
  const t = useTranslations("results.charts");
  const locale = useLocale();
  const monthlyConsumption = getMonthlyConsumption(totalConsumption);
  const months = getMonthNames(locale);

  const data = months.map((month, i) => ({
    month,
    yield: result.yield.monthlyYield[i],
    consumption: Math.round(monthlyConsumption[i]),
  }));

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{t("monthlyYield")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} unit=" kWh" />
            <Tooltip
              formatter={(value, name) => [
                `${Number(value).toLocaleString(locale)} kWh`,
                name,
              ]}
            />
            <Legend />
            <Bar
              dataKey="yield"
              name={t("yield")}
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="consumption"
              name={t("consumption")}
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              opacity={0.7}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
