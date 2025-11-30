import apiClient from "./client";

export interface CreateCategoryData {
  name: string;
  type: "INCOME" | "EXPENSE" | "SAVING";
  icon?: string;
}

export interface UpdateCategoryData {
  name?: string;
  type?: "INCOME" | "EXPENSE" | "SAVING";
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE" | "SAVING";
  icon?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = {
  getAll: async (
    type?: "INCOME" | "EXPENSE" | "SAVING"
  ): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/categories", {
      params: { type },
    });
    return response.data;
  },

  getOne: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await apiClient.post<Category>("/categories", data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
