"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncomeVsExpenses } from "@/lib/api/analytics";
import { Skeleton } from "@/components/ui/skeleton";

import { format } from "date-fns";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface IncomeVsExpensesChartProps {
  data?: IncomeVsExpenses;
  isLoading: boolean;
}

export function IncomeVsExpensesChart({
  data,
  isLoading,
}: IncomeVsExpensesChartProps) {
  const { format: formatCurrency } = useCurrency();

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />;
  }

  // Transform single object data into array for Recharts
  const chartData = data
    ? [
        {
          period: `${format(
            new Date(data.period.startDate),
            "MMM d"
          )} - ${format(new Date(data.period.endDate), "MMM d")}`,
          income: data.income,
          expenses: data.expenses,
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          {!data ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  cursor={{ fill: "transparent" }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
