"use client";

import { Goal } from "@/lib/api/goals";
import { GoalCard } from "./GoalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "lucide-react";

interface GoalListProps {
  goals: Goal[];
  isLoading: boolean;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (goal: Goal) => void;
}

export function GoalList({
  goals,
  isLoading,
  onEdit,
  onDelete,
  onUpdateProgress,
}: GoalListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card text-card-foreground shadow"
          >
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10 h-64">
        <Target className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No goals set</h3>
        <p className="text-muted-foreground max-w-sm">
          Create a savings goal to track your progress towards your financial
          targets.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateProgress={onUpdateProgress}
        />
      ))}
    </div>
  );
}
