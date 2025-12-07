'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryBreakdown } from '@/lib/api/analytics'
import { useCurrency } from '@/lib/hooks/useCurrency'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface CategoryBreakdownChartProps {
  data?: CategoryBreakdown[]
  isLoading: boolean
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
]

export function CategoryBreakdownChart({
  data,
  isLoading,
}: CategoryBreakdownChartProps) {
  const { format } = useCurrency()

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />
  }

  const hasData =
    Array.isArray(data) &&
    data.length > 0 &&
    data.some((d) => d.totalAmount > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {!hasData ? (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data={data as any[]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  label={({
                    name,
                    percent,
                  }: {
                    name?: string
                    percent?: number
                  }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {Array.isArray(data) &&
                    data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => format(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
