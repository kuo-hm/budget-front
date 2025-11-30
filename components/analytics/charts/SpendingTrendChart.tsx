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

interface SpendingTrendChartProps {
  data?: SpendingTrend[];
  isLoading: boolean;
}

export function SpendingTrendChart({
  data,
  isLoading,
}: SpendingTrendChartProps) {
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
                data={Array.isArray(data) ? data : []}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
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
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Amount
                              </span>
                              <span className="font-bold">
                                ${payload[0].value}
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
                  dataKey="amount"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
