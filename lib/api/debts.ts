import apiClient from "./client";

export enum DebtType {
    LOAN = "LOAN",
    CREDIT_CARD = "CREDIT_CARD",
    MORTGAGE = "MORTGAGE",
    PERSONAL_LOAN = "PERSONAL_LOAN",
    OTHER = "OTHER",
}

export enum PaymentFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
}

export interface CreateDebtData {
    name: string;
    type: DebtType;
    principalAmount: number;
    currentBalance: number;
    interestRate: number;
    minimumPayment: number;
    paymentFrequency: PaymentFrequency;
    startDate: string;
    endDate?: string;
    notes?: string;
}

export interface UpdateDebtData {
    name?: string;
    type?: DebtType;
    principalAmount?: number;
    currentBalance?: number;
    interestRate?: number;
    minimumPayment?: number;
    paymentFrequency?: PaymentFrequency;
    startDate?: string;
    endDate?: string;
    notes?: string;
}

export interface Debt {
    id: string;
    name: string;
    type: DebtType;
    principalAmount: number;
    currentBalance: number;
    interestRate: number;
    minimumPayment: number;
    paymentFrequency: PaymentFrequency;
    startDate: string;
    endDate?: string;
    isPaidOff: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    totalPaid?: number;
    totalInterestPaid?: number;
    projectedPayoffDate?: string;
    monthsRemaining?: number;
}

export interface CreateDebtPaymentData {
    amount: number;
    paymentDate: string;
    notes?: string;
}

export interface DebtPayment {
    id: string;
    amount: number;
    paymentDate: string;
    principal: number;
    interest: number;
    notes?: string;
    debtId: string;
    createdAt: string;
}

export interface DebtPayoffDetails {
    currentBalance: number;
    monthlyPayment: number;
    interestRate: number;
    projectedPayoffDate: string;
    totalInterest: number;
    totalAmount: number;
    monthsRemaining: number;
    paymentSchedule: string[]; // Adjust type if more complex structure is revealed later
}

export const debtsApi = {
    getAll: async (): Promise<Debt[]> => {
        const response = await apiClient.get<Debt[]>("/debts");
        return response.data;
    },

    getOne: async (id: string): Promise<Debt> => {
        const response = await apiClient.get<Debt>(`/debts/${id}`);
        return response.data;
    },

    create: async (data: CreateDebtData): Promise<Debt> => {
        const response = await apiClient.post<Debt>("/debts", data);
        return response.data;
    },

    update: async (id: string, data: UpdateDebtData): Promise<Debt> => {
        const response = await apiClient.patch<Debt>(`/debts/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/debts/${id}`);
    },

    addPayment: async (id: string, data: CreateDebtPaymentData): Promise<DebtPayment> => {
        const response = await apiClient.post<DebtPayment>(
            `/debts/${id}/payments`,
            data
        );
        return response.data;
    },

    getPayments: async (id: string): Promise<DebtPayment[]> => {
        const response = await apiClient.get<DebtPayment[]>(`/debts/${id}/payments`);
        return response.data;
    },

    getPayoffDetails: async (id: string): Promise<DebtPayoffDetails> => {
        const response = await apiClient.get<DebtPayoffDetails>(
            `/debts/${id}/payoff-calculator`
        );
        return response.data;
    },
};
