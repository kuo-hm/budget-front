"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetList } from "@/components/budgets/BudgetList";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import {
  useBudgets,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from "@/lib/hooks/useBudgets";
import { Budget, CreateBudgetData } from "@/lib/api/budgets";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

export default function BudgetsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: budgets, isLoading } = useBudgets();
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  // Handlers
  const handleCreate = async (data: CreateBudgetData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Budget created successfully");
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to create budget");
    }
  };

  const handleUpdate = async (data: CreateBudgetData) => {
    if (!editingBudget) return;
    try {
      await updateMutation.mutateAsync({
        id: editingBudget.id,
        data: { ...data },
      });
      toast.success("Budget updated successfully");
      setIsFormOpen(false);
      setEditingBudget(null);
    } catch (error) {
      toast.error("Failed to update budget");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Budget deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const openCreateModal = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Set spending limits and track your progress
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </div>

      <BudgetList
        budgets={budgets || []}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={setDeleteId}
      />

      <BudgetForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingBudget(null);
        }}
        onSubmit={editingBudget ? handleUpdate : handleCreate}
        initialData={editingBudget}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
