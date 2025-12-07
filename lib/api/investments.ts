import apiClient from "./client";

export enum InvestmentType {
    STOCK = "STOCK",
    CRYPTO = "CRYPTO",
    BOND = "BOND",
    ETF = "ETF",
    MUTUAL_FUND = "MUTUAL_FUND",
    OTHER = "OTHER",
}

export interface CreateInvestmentData {
    name: string;
    symbol: string;
    type: InvestmentType;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
}

export interface UpdateInvestmentData {
    name?: string;
    symbol?: string;
    type?: InvestmentType;
    quantity?: number;
    purchasePrice?: number;
    purchaseDate?: string;
}

export interface Investment {
    id: string;
    name: string;
    symbol: string;
    type: InvestmentType;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
    currentPrice?: number;
    currentValue?: number;
    totalCost: number;
    gainLoss?: number;
    gainLossPercent?: number;
    lastUpdated?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PortfolioSummary {
    totalInvested: number;
    totalCurrentValue: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
    investmentCount: number;
    byType: {
        type: InvestmentType;
        value: number;
        percentage: number;
    }[];
}

export const investmentsApi = {
    getAll: async (): Promise<Investment[]> => {
        const response = await apiClient.get<Investment[]>("/investments");
        return response.data;
    },

    getOne: async (id: string): Promise<Investment> => {
        const response = await apiClient.get<Investment>(`/investments/${id}`);
        return response.data;
    },

    create: async (data: CreateInvestmentData): Promise<Investment> => {
        const response = await apiClient.post<Investment>("/investments", data);
        return response.data;
    },

    update: async (id: string, data: UpdateInvestmentData): Promise<Investment> => {
        const response = await apiClient.patch<Investment>(`/investments/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/investments/${id}`);
    },

    getSummary: async (): Promise<PortfolioSummary> => {
        const response = await apiClient.get<PortfolioSummary>("/investments/summary");
        return response.data;
    },

    refreshPrices: async (id?: string): Promise<void> => {
        if (id) {
            await apiClient.post(`/investments/${id}/refresh-prices`);
        } else {
            // Warning: This endpoint might not exist globally if not specified in Swagger, 
            // but assuming there might be a bulk refresh or we iterate. 
            // Based on plan we have refreshPrices(id), let's stick to that or maybe there is a general one.
            // If not, we might need to handle bulk refresh in frontend or backend.
            // For now, let's assume it's per investment.
            // Actually, looking at Swagger "Refresh Prices" wasn't explicitly detailed as a global endpoint.
            // I'll keep it per item for now.
        }
    }
};
