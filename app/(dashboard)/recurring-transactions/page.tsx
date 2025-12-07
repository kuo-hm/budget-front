'use client'

import { RecurringTransactionForm } from '@/components/recurring/RecurringTransactionForm'
import { RecurringTransactionsList } from '@/components/recurring/RecurringTransactionsList'
import { Button } from '@/components/ui/button'
import { CreateRecurringTransactionData } from '@/lib/api/recurring-transactions'
import { useCreateRecurringTransaction } from '@/lib/hooks/useRecurringTransactions'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function RecurringTransactionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const createMutation = useCreateRecurringTransaction()

  const handleCreate = async (data: CreateRecurringTransactionData) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('Recurring transaction scheduled successfully')
      setIsFormOpen(false)
    } catch {
      toast.error('Failed to create recurring transaction')
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />
    </div>
  )
}
