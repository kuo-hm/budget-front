import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  goalsApi,
  CreateGoalData,
  UpdateGoalData,
  UpdateGoalProgressData,
} from "@/lib/api/goals";
export const GOAL_KEYS = {
  all: ["goals"] as const,
  lists: () => [...GOAL_KEYS.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...GOAL_KEYS.lists(), filters] as const,
  details: () => [...GOAL_KEYS.all, "detail"] as const,
  detail: (id: string) => [...GOAL_KEYS.details(), id] as const,
  summaries: () => [...GOAL_KEYS.all, "summary"] as const,
  summary: (startDate: string, endDate: string) =>
    [...GOAL_KEYS.summaries(), { startDate, endDate }] as const,
};

export const useGoals = () => {
  return useQuery({
    queryKey: GOAL_KEYS.lists(),
    queryFn: () => goalsApi.getAll(),
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalData) => goalsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.lists() });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalData }) =>
      goalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.lists() });
    },
  });
};

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalProgressData }) =>
      goalsApi.updateProgress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.lists() });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.lists() });
    },
  });
};
