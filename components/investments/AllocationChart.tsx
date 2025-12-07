"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PortfolioSummary } from "@/lib/api/investments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface AllocationChartProps {
  summary?: PortfolioSummary;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function AllocationChart({ summary }: AllocationChartProps) {
  if (!summary || summary.investmentCount === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No investments to display
        </CardContent>
      </Card>
    );
  }

  const data = summary.byType.map((item) => ({
    name: item.type,
    value: item.value,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
