"use client";

import {
  useBudgetPerformance,
  useCategoryBreakdown,
  useHealthScore,
  useIncomeVsExpenses,
  useMonthlySummary,
  useSavingsRate,
  useSpendingTrends,
  useYearComparison,
} from "@/lib/hooks/useAnalytics";
import { MonthlySummaryGrid } from "@/components/analytics/widgets/MonthlySummaryGrid";
import { HealthScoreGauge } from "@/components/analytics/widgets/HealthScoreGauge";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SpendingTrendChart = lazy(() =>
  import("@/components/analytics/charts/SpendingTrendChart").then((module) => ({
    default: module.SpendingTrendChart,
  }))
);
const CategoryBreakdownChart = lazy(() =>
  import("@/components/analytics/charts/CategoryBreakdownChart").then(
    (module) => ({ default: module.CategoryBreakdownChart })
  )
);
const IncomeVsExpensesChart = lazy(() =>
  import("@/components/analytics/charts/IncomeVsExpensesChart").then(
    (module) => ({ default: module.IncomeVsExpensesChart })
  )
);
const BudgetPerformanceChart = lazy(() =>
  import("@/components/analytics/charts/BudgetPerformanceChart").then(
    (module) => ({ default: module.BudgetPerformanceChart })
  )
);
const SavingsRateChart = lazy(() =>
  import("@/components/analytics/charts/SavingsRateChart").then((module) => ({
    default: module.SavingsRateChart,
  }))
);
const YearComparisonChart = lazy(() =>
  import("@/components/analytics/charts/YearComparisonChart").then(
    (module) => ({ default: module.YearComparisonChart })
  )
);

export default function AnalyticsPage() {
  // Fetch data
  const { data: monthlySummary, isLoading: isSummaryLoading } =
    useMonthlySummary();
  const { data: spendingTrends, isLoading: isTrendsLoading } =
    useSpendingTrends();
  const dateRange = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      startDate: startOfMonth.toISOString(),
      endDate: now.toISOString(),
    };
  }, []);

  const { data: categoryBreakdown, isLoading: isCategoryLoading } =
    useCategoryBreakdown(dateRange.startDate, dateRange.endDate);
  const { data: incomeVsExpenses, isLoading: isIncomeLoading } =
    useIncomeVsExpenses();
  const { data: budgetPerformance, isLoading: isBudgetLoading } =
    useBudgetPerformance();
  const { data: savingsRate, isLoading: isSavingsLoading } = useSavingsRate();
  const { data: yearComparison, isLoading: isYearLoading } =
    useYearComparison();
  const { data: healthScore, isLoading: isHealthLoading } = useHealthScore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Deep dive into your financial data and performance.
        </p>
      </div>

      <MonthlySummaryGrid data={monthlySummary} isLoading={isSummaryLoading} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
          <SpendingTrendChart
            data={spendingTrends}
            isLoading={isTrendsLoading}
          />
        </Suspense>
        <HealthScoreGauge data={healthScore} isLoading={isHealthLoading} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
          <IncomeVsExpensesChart
            data={incomeVsExpenses}
            isLoading={isIncomeLoading}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
          <CategoryBreakdownChart
            data={categoryBreakdown}
            isLoading={isCategoryLoading}
          />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
          <BudgetPerformanceChart
            data={budgetPerformance}
            isLoading={isBudgetLoading}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
          <SavingsRateChart data={savingsRate} isLoading={isSavingsLoading} />
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
        <YearComparisonChart data={yearComparison} isLoading={isYearLoading} />
      </Suspense>
    </motion.div>
  );
}
