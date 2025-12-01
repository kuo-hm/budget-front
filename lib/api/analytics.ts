import apiClient from "./client";

export interface CategoryBreakdown {
  categoryName: string;
  totalAmount: number;
  percentage: number;
  color?: string;
}

export interface SpendingTrend {
  date: string;
  income: number;
  expenses: number;
}

export interface IncomeVsExpenses {
  income: number;
  expenses: number;
  netSavings: number;
  savingsRate: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface TopCategory {
  categoryId: string;
  name: string;
  amount: number;
  transactionCount: number;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

export interface BudgetPerformanceItem {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: "on-track" | "warning" | "over";
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface BudgetPerformanceResponse {
  budgets: BudgetPerformanceItem[];
  summary: {
    total: number;
    onTrack: number;
    warning: number;
    over: number;
  };
}

export interface SavingsRateMonth {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

export interface SavingsRateResponse {
  averageSavingsRate: number;
  trend: string;
  monthlyBreakdown: SavingsRateMonth[];
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface CashFlow {
  date: string;
  income: number;
  expenses: number;
  net: number;
  accumulated: number;
}

export interface HeatmapData {
  date: string;
  count: number;
  amount: number;
  intensity: number; // 0-4
}

export interface YearComparisonMonth {
  month: string;
  currentYear: {
    income: number;
    expenses: number;
    savings: number;
  };
  previousYear: {
    income: number;
    expenses: number;
    savings: number;
  };
  changes: {
    income: number;
    expenses: number;
  };
}

export interface YearComparisonResponse {
  currentYear: number;
  previousYear: number;
  monthlyComparison: YearComparisonMonth[];
  yearlyTotals: {
    currentYear: {
      income: number;
      expenses: number;
      savings: number;
    };
    previousYear: {
      income: number;
      expenses: number;
      savings: number;
    };
  };
}

export interface HealthScore {
  score: number; // 0-100
  status: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  factors: {
    name: string;
    impact: "POSITIVE" | "NEGATIVE";
    description: string;
  }[];
}

export const analyticsApi = {
  getCategoryBreakdown: async (
    startDate: string,
    endDate: string
  ): Promise<CategoryBreakdown[]> => {
    const response = await apiClient.get<CategoryBreakdown[]>(
      "/analytics/category-breakdown",
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  },

  getSpendingTrends: async (
    period: "daily" | "weekly" | "monthly" = "daily",
    periods: number = 30
  ): Promise<SpendingTrend[]> => {
    const response = await apiClient.get<SpendingTrend[]>(
      "/analytics/spending-trends",
      {
        params: { period, periods },
      }
    );
    return response.data;
  },

  getIncomeVsExpenses: async (
    startDate?: string,
    endDate?: string
  ): Promise<IncomeVsExpenses> => {
    const response = await apiClient.get<IncomeVsExpenses>(
      "/analytics/income-vs-expenses",
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  },

  getTopCategories: async (
    limit: number = 5,
    period: "week" | "month" | "year" = "month",
    type: "INCOME" | "EXPENSE" = "EXPENSE"
  ): Promise<TopCategory[]> => {
    const response = await apiClient.get<TopCategory[]>(
      "/analytics/top-categories",
      {
        params: { limit, period, type },
      }
    );
    return response.data;
  },

  getMonthlySummary: async (month?: string): Promise<MonthlySummary> => {
    const response = await apiClient.get<MonthlySummary>(
      "/analytics/monthly-summary",
      {
        params: { month },
      }
    );
    return response.data;
  },

  getBudgetPerformance: async (): Promise<BudgetPerformanceResponse> => {
    const response = await apiClient.get<BudgetPerformanceResponse>(
      "/analytics/budget-performance"
    );
    return response.data;
  },

  getSavingsRate: async (
    period: "month" | "quarter" | "year" = "year"
  ): Promise<SavingsRateResponse> => {
    const response = await apiClient.get<SavingsRateResponse>(
      "/analytics/savings-rate",
      {
        params: { period },
      }
    );
    return response.data;
  },

  getCashFlow: async (
    startDate?: string,
    endDate?: string
  ): Promise<CashFlow[]> => {
    const response = await apiClient.get<CashFlow[]>("/analytics/cash-flow", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getSpendingHeatmap: async (year?: number): Promise<HeatmapData[]> => {
    const response = await apiClient.get<HeatmapData[]>(
      "/analytics/spending-heatmap",
      {
        params: { year },
      }
    );
    return response.data;
  },

  getYearComparison: async (year?: number): Promise<YearComparisonResponse> => {
    const response = await apiClient.get<YearComparisonResponse>(
      "/analytics/year-comparison",
      {
        params: { year },
      }
    );
    return response.data;
  },

  getHealthScore: async (): Promise<HealthScore> => {
    const response = await apiClient.get<HealthScore>(
      "/analytics/health-score"
    );
    return response.data;
  },
};
