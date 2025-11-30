"use client";

import { useState, useRef } from "react";
import { Plus, Trash, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { motion } from "framer-motion";
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useExportTransactions,
  useImportTransactions,
} from "@/lib/hooks/useTransactions";
import {
  Transaction,
  TransactionFilters as FilterType,
  CreateTransactionData,
} from "@/lib/api/transactions";
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

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    limit: 10,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data, isLoading } = useTransactions(filters);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const exportMutation = useExportTransactions();
  const importMutation = useImportTransactions();

  // Handlers
  const handleCreate = async (data: CreateTransactionData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Transaction created successfully");
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to create transaction");
    }
  };

  const handleUpdate = async (data: CreateTransactionData) => {
    if (!editingTransaction) return;
    try {
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        data: { ...data, id: editingTransaction.id },
      });
      toast.success("Transaction updated successfully");
      setIsFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      toast.error("Failed to update transaction");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Transaction deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync(filters);
      if (blob) {
        const url = window.URL.createObjectURL(new Blob([blob as any]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `transactions-${new Date().toISOString()}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      toast.success("Transactions exported successfully");
    } catch (error) {
      toast.error("Failed to export transactions");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importMutation.mutateAsync(file);
      toast.success("Transactions imported successfully");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to import transactions");
    }
  };

  const openCreateModal = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
          />
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleImportClick}
            disabled={importMutation.isPending}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <TransactionSummary
        startDate={filters.startDate}
        endDate={filters.endDate}
      />

      <TransactionFilters filters={filters} onFilterChange={setFilters} />

      <TransactionList
        transactions={data?.data || []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(page) => setFilters({ ...filters, page })}
        onEdit={openEditModal}
        onDelete={setDeleteId}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <TransactionForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        onSubmit={editingTransaction ? handleUpdate : handleCreate}
        initialData={editingTransaction}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Single Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction.
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
