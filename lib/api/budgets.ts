import apiClient from "./client";
import { Category } from "./categories";

export enum Frequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface Budget {
  id: string;
  limitAmount: number;
  startDate: string;
  endDate: string | null;
  frequency: Frequency | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  spentAmount: number;
  percentageUsed: number;
}

export interface CreateBudgetData {
  limitAmount: number;
  startDate: string;
  endDate?: string;
  categoryId: string;
  frequency?: Frequency;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateBudgetData extends Partial<CreateBudgetData> {}

export const budgetsApi = {
  getAll: async (): Promise<Budget[]> => {
    const response = await apiClient.get<Budget[]>("/budgets");
    return response.data;
  },

  getOne: async (id: string): Promise<Budget> => {
    const response = await apiClient.get<Budget>(`/budgets/${id}`);
    return response.data;
  },

  create: async (data: CreateBudgetData): Promise<Budget> => {
    const response = await apiClient.post<Budget>("/budgets", data);
    return response.data;
  },

  update: async (id: string, data: UpdateBudgetData): Promise<Budget> => {
    const response = await apiClient.patch<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },
};
