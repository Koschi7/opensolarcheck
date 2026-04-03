"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { CalculationResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  result: CalculationResult;
}

export function FinancialChart({ result }: Props) {
  const t = useTranslations("results.charts");
  const locale = useLocale();

  const data = [
    {
      year: 0,
      cumulativeSavings: -result.economics.totalInvestment,
    },
    ...result.economics.yearlyData.map((d) => ({
      year: d.year,
      cumulativeSavings: d.cumulativeSavings,
    })),
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="text-lg">{t("financial")}</CardTitle>
        <Badge variant="secondary" className="bg-green-100 text-green-800 whitespace-nowrap">
          {t("breakEven")}: {result.economics.paybackYears} {t("yearsAxis")}
        </Badge>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              fontSize={12}
              label={{
                value: t("yearsAxis"),
                position: "bottom",
                fontSize: 12,
              }}
            />
            <YAxis
              fontSize={12}
              tickFormatter={(v) =>
                `${(v / 1000).toFixed(0)}k €`
              }
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value).toLocaleString(locale)} €`,
                t("cumulativeSavings"),
              ]}
              labelFormatter={(label) => t("yearLabel", { label })}
            />
            <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="cumulativeSavings"
              stroke="#10B981"
              strokeWidth={3}
              dot={false}
              name={t("cumulativeSavings")}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
