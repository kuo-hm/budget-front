import apiClient from "./client";

export interface RecurringTransaction {
  id: string;
  amount: number;
  description?: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: string;
  endDate?: string;
  nextRunDate: string;
  isActive: boolean;
  categoryId: string;
}

export interface CreateRecurringTransactionData {
  amount: number;
  description: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: string;
  endDate?: string;
  categoryId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateRecurringTransactionData
  extends Partial<CreateRecurringTransactionData> {}

export const recurringTransactionsApi = {
  getAll: async (): Promise<RecurringTransaction[]> => {
    const response = await apiClient.get<RecurringTransaction[]>(
      "/recurring-transactions"
    );
    return response.data;
  },

  create: async (
    data: CreateRecurringTransactionData
  ): Promise<RecurringTransaction> => {
    const response = await apiClient.post<RecurringTransaction>(
      "/recurring-transactions",
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateRecurringTransactionData
  ): Promise<RecurringTransaction> => {
    const response = await apiClient.patch<RecurringTransaction>(
      `/recurring-transactions/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/recurring-transactions/${id}`);
  },
};
