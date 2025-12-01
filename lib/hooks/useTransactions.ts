import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transactionsApi,
  TransactionFilters,
  CreateTransactionData,
  UpdateTransactionData,
} from "@/lib/api/transactions";

export const TRANSACTION_KEYS = {
  all: ["transactions"] as const,
  lists: () => [...TRANSACTION_KEYS.all, "list"] as const,
  list: (filters: TransactionFilters) =>
    [...TRANSACTION_KEYS.lists(), filters] as const,
  details: () => [...TRANSACTION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...TRANSACTION_KEYS.details(), id] as const,
  summaries: () => [...TRANSACTION_KEYS.all, "summary"] as const,
  summary: (startDate: string, endDate: string) =>
    [...TRANSACTION_KEYS.summaries(), { startDate, endDate }] as const,
};

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: TRANSACTION_KEYS.list(filters),
    queryFn: () => transactionsApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: TRANSACTION_KEYS.detail(id),
    queryFn: () => transactionsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.summaries() });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionData }) =>
      transactionsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.summaries() });
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_KEYS.detail(data.id),
      });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.summaries() });
    },
  });
}

export function useExportTransactions() {
  return useMutation({
    mutationFn: (filters?: TransactionFilters) =>
      transactionsApi.export(filters),
  });
}

export function useImportTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => transactionsApi.import(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.summaries() });
    },
  });
}
