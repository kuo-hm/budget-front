import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    CreateInvestmentData,
    investmentsApi,
    UpdateInvestmentData,
} from "../api/investments";
import { toast } from "sonner";

export const INVESTMENT_KEYS = {
    all: ["investments"] as const,
    lists: () => [...INVESTMENT_KEYS.all, "list"] as const,
    details: () => [...INVESTMENT_KEYS.all, "detail"] as const,
    detail: (id: string) => [...INVESTMENT_KEYS.details(), id] as const,
    summary: () => [...INVESTMENT_KEYS.all, "summary"] as const,
};

export function useInvestments() {
    return useQuery({
        queryKey: INVESTMENT_KEYS.lists(),
        queryFn: investmentsApi.getAll,
    });
}

export function useInvestment(id: string) {
    return useQuery({
        queryKey: INVESTMENT_KEYS.detail(id),
        queryFn: () => investmentsApi.getOne(id),
        enabled: !!id,
    });
}

export function usePortfolioSummary() {
    return useQuery({
        queryKey: INVESTMENT_KEYS.summary(),
        queryFn: investmentsApi.getSummary,
    });
}

export function useCreateInvestment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateInvestmentData) => investmentsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.summary() });
            toast.success("Investment added successfully");
        },
        onError: () => {
            toast.error("Failed to add investment");
        },
    });
}

export function useUpdateInvestment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateInvestmentData }) =>
            investmentsApi.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.summary() });
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.detail(data.id) });
            toast.success("Investment updated successfully");
        },
        onError: () => {
            toast.error("Failed to update investment");
        },
    });
}

export function useDeleteInvestment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => investmentsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.summary() });
            toast.success("Investment deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete investment");
        },
    });
}

export function useRefreshInvestmentPrices() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => investmentsApi.refreshPrices(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.summary() });
            queryClient.invalidateQueries({ queryKey: INVESTMENT_KEYS.detail(id) });
            toast.success("Prices refreshed successfully");
        },
        onError: () => {
            toast.error("Failed to refresh prices");
        },
    });
}
