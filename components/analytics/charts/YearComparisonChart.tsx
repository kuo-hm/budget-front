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
import { YearComparison } from "@/lib/api/analytics";
import { Skeleton } from "@/components/ui/skeleton";

interface YearComparisonChartProps {
  data?: YearComparison[];
  isLoading: boolean;
}

export function YearComparisonChart({
  data,
  isLoading,
}: YearComparisonChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year over Year Comparison</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          {!data || data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={Array.isArray(data) ? data : []}
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value)
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="currentYear"
                  name="Current Year"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="previousYear"
                  name="Previous Year"
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
