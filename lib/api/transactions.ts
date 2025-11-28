import apiClient from './client';

export interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  description?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  description?: string;
  currency: string;
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  id: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

export const transactionsApi = {
  getAll: async (filters?: TransactionFilters): Promise<TransactionsResponse> => {
    const response = await apiClient.get<TransactionsResponse>('/transactions', {
      params: filters,
    });
    return response.data;
  },

  getOne: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTransactionData): Promise<Transaction> => {
    const response = await apiClient.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    await apiClient.post('/transactions/bulk-delete', { ids });
  },
};
