import apiClient from './client'

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentSaved: number
  targetDate?: string
  percentageCompleted: number
  remainingAmount: number
}

export interface CreateGoalData {
  name: string
  targetAmount: number
  targetDate?: Date
}

export interface UpdateGoalProgressData {
  currentSaved: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateGoalData extends Partial<CreateGoalData> {}

export const goalsApi = {
  getAll: async (): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>('/goals')
    return response.data
  },

  create: async (data: CreateGoalData): Promise<Goal> => {
    const response = await apiClient.post<Goal>('/goals', data)
    return response.data
  },

  update: async (id: string, data: UpdateGoalData): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(`/goals/${id}`, data)
    return response.data
  },

  updateProgress: async (
    id: string,
    data: UpdateGoalProgressData,
  ): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(`/goals/${id}/progress`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`)
  },
}
