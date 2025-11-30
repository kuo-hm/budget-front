"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecurringTransactionList } from "@/components/recurring/RecurringTransactionList";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import {
  useRecurringTransactions,
  useCreateRecurringTransaction,
  useUpdateRecurringTransaction,
  useDeleteRecurringTransaction,
} from "@/lib/hooks/useRecurringTransactions";
import {
  RecurringTransaction,
  CreateRecurringTransactionData,
} from "@/lib/api/recurring-transactions";
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

export default function RecurringTransactionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<RecurringTransaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: transactions, isLoading } = useRecurringTransactions();
  const createMutation = useCreateRecurringTransaction();
  const updateMutation = useUpdateRecurringTransaction();
  const deleteMutation = useDeleteRecurringTransaction();

  // Handlers
  const handleCreate = async (data: CreateRecurringTransactionData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Recurring transaction created successfully");
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to create recurring transaction");
    }
  };

  const handleUpdate = async (data: CreateRecurringTransactionData) => {
    if (!editingTransaction) return;
    try {
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        data: { ...data },
      });
      toast.success("Recurring transaction updated successfully");
      setIsFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      toast.error("Failed to update recurring transaction");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Recurring transaction deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete recurring transaction");
    }
  };

  const openCreateModal = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const openEditModal = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
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
          <h1 className="text-3xl font-bold tracking-tight">
            Recurring Transactions
          </h1>
          <p className="text-muted-foreground">
            Manage your automated income and expenses
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Recurring
        </Button>
      </div>

      <RecurringTransactionList
        transactions={transactions || []}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={setDeleteId}
      />

      <RecurringTransactionForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        onSubmit={editingTransaction ? handleUpdate : handleCreate}
        initialData={editingTransaction}
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
              recurring transaction.
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
