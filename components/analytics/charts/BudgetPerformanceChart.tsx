"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BudgetPerformanceResponse,
  BudgetPerformanceItem,
} from "@/lib/api/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface BudgetPerformanceChartProps {
  data?: BudgetPerformanceResponse;
  isLoading: boolean;
}

export function BudgetPerformanceChart({
  data,
  isLoading,
}: BudgetPerformanceChartProps) {
  const { format } = useCurrency();

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />;
  }

  const chartData = data?.budgets || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Performance</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          {!chartData || chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 40,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  width={100}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as BudgetPerformanceItem;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-bold">{data.category}</div>
                          <div className="text-sm text-muted-foreground">
                            Spent: {format(data.spent)} / {format(data.limit)}
                          </div>
                          <div className="text-sm font-medium">
                            {Math.round(data.percentageUsed)}% Used
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="percentageUsed"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.percentageUsed > 100
                          ? "#ef4444"
                          : entry.percentageUsed > 80
                          ? "#f59e0b"
                          : "#10b981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
