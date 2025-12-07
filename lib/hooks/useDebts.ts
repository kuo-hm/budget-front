import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    CreateDebtData,
    CreateDebtPaymentData,
    debtsApi,
    UpdateDebtData,
} from "../api/debts";
import { toast } from "sonner";

export const DEBT_KEYS = {
    all: ["debts"] as const,
    lists: () => [...DEBT_KEYS.all, "list"] as const,
    details: () => [...DEBT_KEYS.all, "detail"] as const,
    detail: (id: string) => [...DEBT_KEYS.details(), id] as const,
    payments: (id: string) => [...DEBT_KEYS.detail(id), "payments"] as const,
    payoff: (id: string) => [...DEBT_KEYS.detail(id), "payoff"] as const,
};

export function useDebts() {
    return useQuery({
        queryKey: DEBT_KEYS.lists(),
        queryFn: debtsApi.getAll,
    });
}

export function useDebt(id: string) {
    return useQuery({
        queryKey: DEBT_KEYS.detail(id),
        queryFn: () => debtsApi.getOne(id),
        enabled: !!id,
    });
}

export function useCreateDebt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDebtData) => debtsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEBT_KEYS.lists() });
            toast.success("Debt created successfully");
        },
        onError: () => {
            toast.error("Failed to create debt");
        },
    });
}

export function useUpdateDebt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDebtData }) =>
            debtsApi.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: DEBT_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: DEBT_KEYS.detail(data.id) });
            toast.success("Debt updated successfully");
        },
        onError: () => {
            toast.error("Failed to update debt");
        },
    });
}

export function useDeleteDebt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => debtsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEBT_KEYS.lists() });
            toast.success("Debt deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete debt");
        },
    });
}

export function useDebtPayments(id: string) {
    return useQuery({
        queryKey: DEBT_KEYS.payments(id),
        queryFn: () => debtsApi.getPayments(id),
        enabled: !!id,
    });
}

export function useAddDebtPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: CreateDebtPaymentData;
        }) => debtsApi.addPayment(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: DEBT_KEYS.payments(data.debtId) });
            queryClient.invalidateQueries({ queryKey: DEBT_KEYS.detail(data.debtId) });
            queryClient.invalidateQueries({ queryKey: DEBT_KEYS.lists() }); // Balance changes
            queryClient.invalidateQueries({ queryKey: DEBT_KEYS.payoff(data.debtId) }); // Payoff changes
            toast.success("Payment added successfully");
        },
        onError: () => {
            toast.error("Failed to add payment");
        },
    });
}

export function useDebtPayoffDetails(id: string) {
    return useQuery({
        queryKey: DEBT_KEYS.payoff(id),
        queryFn: () => debtsApi.getPayoffDetails(id),
        enabled: !!id,
    });
}
