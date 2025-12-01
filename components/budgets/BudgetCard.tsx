"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, AlertCircle } from "lucide-react";
import { Budget } from "@/lib/api/budgets";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { format: formatCurrency } = useCurrency();
  const percentage = Math.min(budget.percentageUsed, 100);

  // Determine color based on percentage
  let progressColor = "bg-emerald-500";
  let textColor = "text-emerald-500";

  if (percentage >= 80) {
    progressColor = "bg-rose-500";
    textColor = "text-rose-500";
  } else if (percentage >= 50) {
    progressColor = "bg-amber-500";
    textColor = "text-amber-500";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {budget.category?.name || "Uncategorized"}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(budget)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(budget.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(budget.limitAmount)}
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {format(new Date(budget.startDate), "MMM d")}
            {budget.endDate
              ? ` - ${format(new Date(budget.endDate), "MMM d, yyyy")}`
              : ""}
            {budget.frequency && ` • ${budget.frequency}`}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Spent</span>
              <span className={`font-medium ${textColor}`}>
                {formatCurrency(budget.spentAmount)} (
                {Math.round(budget.percentageUsed)}%)
              </span>
            </div>
            <Progress
              value={percentage}
              className={`h-2`}
              indicatorClassName={progressColor}
            />
            {percentage >= 100 && (
              <div className="flex items-center text-xs text-rose-500 mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Over budget
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
