import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  recurringTransactionsApi,
  CreateRecurringTransactionData,
  UpdateRecurringTransactionData,
} from "@/lib/api/recurring-transactions";

export const useRecurringTransactions = () => {
  return useQuery({
    queryKey: ["recurring-transactions"],
    queryFn: () => recurringTransactionsApi.getAll(),
  });
};

export const useCreateRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecurringTransactionData) =>
      recurringTransactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
    },
  });
};

export const useUpdateRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRecurringTransactionData;
    }) => recurringTransactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
    },
  });
};

export const useDeleteRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recurringTransactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
    },
  });
};
