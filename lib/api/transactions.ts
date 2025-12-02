import apiClient from "./client";
import { Category } from "./categories";

export interface Transaction {
  id: string;
  amount: number;
  description?: string;
  date: string;
  categoryId: string;
  category: Category;
  userId: string;
  currency: string;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  amount: number;
  description?: string;
  date: string;
  categoryId: string;
  goalId?: string;
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  id?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: "INCOME" | "EXPENSE" | "SAVING";
  categoryId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
  netBalance: number;
}

export const transactionsApi = {
  getAll: async (
    filters?: TransactionFilters
  ): Promise<TransactionsResponse> => {
    const response = await apiClient.get<TransactionsResponse>(
      "/transactions",
      {
        params: filters,
      }
    );
    return response.data;
  },

  getSummary: async (
    startDate: string,
    endDate: string
  ): Promise<TransactionSummary> => {
    const response = await apiClient.get<TransactionSummary>(
      "/transactions/summary",
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  },

  getOne: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>("/transactions", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateTransactionData
  ): Promise<Transaction> => {
    const response = await apiClient.patch<Transaction>(
      `/transactions/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  export: async (filters?: TransactionFilters): Promise<Blob> => {
    const response = await apiClient.get("/transactions/export", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  import: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);
    await apiClient.post("/transactions/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
