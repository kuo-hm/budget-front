'use client';

import { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useBulkDeleteTransactions,
} from '@/lib/hooks/useTransactions';
import { Transaction, TransactionFilters as FilterType, CreateTransactionData, UpdateTransactionData } from '@/lib/api/transactions';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    limit: 10,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Queries & Mutations
  const { data, isLoading } = useTransactions(filters);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const bulkDeleteMutation = useBulkDeleteTransactions();

  // Handlers
  const handleCreate = async (data: CreateTransactionData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Transaction created successfully');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to create transaction');
    }
  };

  const handleUpdate = async (data: CreateTransactionData) => {
    if (!editingTransaction) return;
    try {
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        data: { ...data, id: editingTransaction.id }
      });
      toast.success('Transaction updated successfully');
      setIsFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      toast.error('Failed to update transaction');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Transaction deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(selectedIds);
      toast.success('Transactions deleted successfully');
      setSelectedIds([]);
      setIsBulkDeleteOpen(false);
    } catch (error) {
      toast.error('Failed to delete transactions');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsBulkDeleteOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <TransactionFilters
        filters={filters}
        onFilterChange={setFilters}
      />

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
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
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

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedIds.length} transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
