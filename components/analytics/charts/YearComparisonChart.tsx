"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YearComparisonResponse } from "@/lib/api/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface YearComparisonChartProps {
  data?: YearComparisonResponse;
  isLoading: boolean;
}

export function YearComparisonChart({
  data,
  isLoading,
}: YearComparisonChartProps) {
  const { format } = useCurrency();

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />;
  }

  // Transform nested data for Recharts
  const chartData =
    data?.monthlyComparison.map((item) => ({
      month: item.month,
      currentYear: item.currentYear.income, // Using Income for comparison
      previousYear: item.previousYear.income,
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year over Year Comparison (Income)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          {!chartData || chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => format(value)}
                />
                <Tooltip formatter={(value: number) => format(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="currentYear"
                  name={`Current Year (${data?.currentYear})`}
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="previousYear"
                  name={`Previous Year (${data?.previousYear})`}
                  stroke="#82ca9d"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
