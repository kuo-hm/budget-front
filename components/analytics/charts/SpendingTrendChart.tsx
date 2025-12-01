"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpendingTrend } from "@/lib/api/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface SpendingTrendChartProps {
  data?: SpendingTrend[];
  isLoading: boolean;
}

export function SpendingTrendChart({
  data,
  isLoading,
}: SpendingTrendChartProps) {
  const { format: formatCurrency } = useCurrency();

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          {!data || data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={
                  Array.isArray(data)
                    ? data.map((item) => ({
                        ...item,
                        income: item.income,
                        expenses: Math.abs(item.expenses),
                      }))
                    : []
                }
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => format(new Date(value), "MMM d")}
                  minTickGap={30}
                  tickMargin={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {label
                                  ? format(new Date(label), "MMM d, yyyy")
                                  : ""}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-emerald-500">
                                Income
                              </span>
                              <span className="font-bold text-emerald-500">
                                {formatCurrency(
                                  (payload.find((p) => p.dataKey === "income")
                                    ?.value as number) || 0
                                )}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-rose-500">
                                Expenses
                              </span>
                              <span className="font-bold text-rose-500">
                                {formatCurrency(
                                  (payload.find((p) => p.dataKey === "expenses")
                                    ?.value as number) || 0
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
