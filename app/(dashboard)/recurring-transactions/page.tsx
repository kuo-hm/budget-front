"use client";

import { useState } from "react";
import { RecurringTransactionsList } from "@/components/recurring/RecurringTransactionsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RecurringTransactionForm } from "@/components/transactions/RecurringTransactionForm";
import { useCreateRecurringTransaction } from "@/lib/hooks/useRecurringTransactions";
import { CreateRecurringTransactionData } from "@/lib/api/recurring-transactions";
import { toast } from "sonner";

export default function RecurringTransactionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const createMutation = useCreateRecurringTransaction();

  const handleCreate = async (data: CreateRecurringTransactionData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Recurring transaction scheduled successfully");
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to create recurring transaction");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Recurring Transactions
        </h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Recurring
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <RecurringTransactionsList />
      </div>
      <RecurringTransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
