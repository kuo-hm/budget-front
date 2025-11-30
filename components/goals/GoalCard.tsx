"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Plus, Target } from "lucide-react";
import { Goal } from "@/lib/api/goals";
import { format } from "date-fns";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (goal: Goal) => void;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onUpdateProgress,
}: GoalCardProps) {
  const percentage = Math.min(goal.percentageCompleted, 100);
  const isCompleted = percentage >= 100;

  useEffect(() => {
    if (isCompleted) {
      const end = Date.now() + 1000;
      const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isCompleted]);

  // Circular Progress Calculation
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let progressColor = "text-emerald-500";
  if (percentage < 30) progressColor = "text-rose-500";
  else if (percentage < 70) progressColor = "text-amber-500";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden relative">
        {isCompleted && (
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            {goal.name}
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
              <DropdownMenuItem onClick={() => onEdit(goal)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(goal.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(goal.currentSaved)}
              </div>
              <p className="text-xs text-muted-foreground">
                of{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(goal.targetAmount)}
              </p>
              {goal.targetDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {format(new Date(goal.targetDate), "MMM d, yyyy")}
                </p>
              )}
            </div>

            <div className="relative flex items-center justify-center">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  className="text-muted/20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
                <circle
                  className={`${progressColor} transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
              </svg>
              <span className={`absolute text-sm font-bold ${progressColor}`}>
                {Math.round(percentage)}%
              </span>
            </div>
          </div>

          <Button
            className="w-full mt-4"
            variant={isCompleted ? "outline" : "default"}
            onClick={() => onUpdateProgress(goal)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isCompleted ? "Update Funds" : "Add Funds"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
