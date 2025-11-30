"use client";

import { Budget } from "@/lib/api/budgets";
import { BudgetCard } from "./BudgetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart } from "lucide-react";

interface BudgetListProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetList({
  budgets,
  isLoading,
  onEdit,
  onDelete,
}: BudgetListProps) {
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
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10 h-64">
        <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No budgets set</h3>
        <p className="text-muted-foreground max-w-sm">
          Create a budget to track your spending for specific categories and
          stay on top of your finances.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
