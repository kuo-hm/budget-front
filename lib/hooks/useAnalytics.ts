import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics";

export const useCategoryBreakdown = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["analytics", "category-breakdown", startDate, endDate],
    queryFn: () => analyticsApi.getCategoryBreakdown(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useSpendingTrends = (
  period: "daily" | "weekly" | "monthly" = "daily",
  periods: number = 30
) => {
  return useQuery({
    queryKey: ["analytics", "spending-trends", period, periods],
    queryFn: () => analyticsApi.getSpendingTrends(period, periods),
  });
};

export const useIncomeVsExpenses = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["analytics", "income-vs-expenses", startDate, endDate],
    queryFn: () => analyticsApi.getIncomeVsExpenses(startDate, endDate),
  });
};

export const useTopCategories = (
  limit: number = 5,
  period: "week" | "month" | "year" = "month",
  type: "INCOME" | "EXPENSE" = "EXPENSE"
) => {
  return useQuery({
    queryKey: ["analytics", "top-categories", limit, period, type],
    queryFn: () => analyticsApi.getTopCategories(limit, period, type),
  });
};

export const useMonthlySummary = (month?: string) => {
  return useQuery({
    queryKey: ["analytics", "monthly-summary", month],
    queryFn: () => analyticsApi.getMonthlySummary(month),
  });
};

export const useBudgetPerformance = () => {
  return useQuery({
    queryKey: ["analytics", "budget-performance"],
    queryFn: () => analyticsApi.getBudgetPerformance(),
  });
};

export const useSavingsRate = (
  period: "month" | "quarter" | "year" = "year"
) => {
  return useQuery({
    queryKey: ["analytics", "savings-rate", period],
    queryFn: () => analyticsApi.getSavingsRate(period),
  });
};

export const useCashFlow = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["analytics", "cash-flow", startDate, endDate],
    queryFn: () => analyticsApi.getCashFlow(startDate, endDate),
  });
};

export const useSpendingHeatmap = (year?: number) => {
  return useQuery({
    queryKey: ["analytics", "spending-heatmap", year],
    queryFn: () => analyticsApi.getSpendingHeatmap(year),
  });
};

export const useYearComparison = (year?: number) => {
  return useQuery({
    queryKey: ["analytics", "year-comparison", year],
    queryFn: () => analyticsApi.getYearComparison(year),
  });
};

export const useHealthScore = () => {
  return useQuery({
    queryKey: ["analytics", "health-score"],
    queryFn: () => analyticsApi.getHealthScore(),
  });
};
