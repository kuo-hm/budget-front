'use client'

import { BudgetForm } from '@/components/budgets/BudgetForm'
import { BudgetList } from '@/components/budgets/BudgetList'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Budget, CreateBudgetData } from '@/lib/api/budgets'
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from '@/lib/hooks/useBudgets'
import { exportToCSV } from '@/lib/utils/export'
import { motion } from 'framer-motion'
import { Download, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function BudgetsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Queries & Mutations
  const { data: budgets, isLoading } = useBudgets()
  const createMutation = useCreateBudget()
  const updateMutation = useUpdateBudget()
  const deleteMutation = useDeleteBudget()

  // Handlers
  const handleCreate = async (data: CreateBudgetData) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('Budget created successfully')
      setIsFormOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      toast.error('Failed to create budget')
    }
  }

  const handleUpdate = async (data: CreateBudgetData) => {
    if (!editingBudget) return
    try {
      await updateMutation.mutateAsync({
        id: editingBudget.id,
        data: { ...data },
      })
      toast.success('Budget updated successfully')
      setIsFormOpen(false)
      setEditingBudget(null)
    } catch {
      toast.error('Failed to update budget')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success('Budget deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete budget')
    }
  }

  const openCreateModal = () => {
    setEditingBudget(null)
    setIsFormOpen(true)
  }

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget)
    setIsFormOpen(true)
  }

  const handleExport = () => {
    if (!budgets) return
    const data = budgets.map((b) => ({
      Category: b.category?.name || 'N/A',
      Limit: b.limitAmount,
      Spent: b.spentAmount,
      Remaining: b.limitAmount - b.spentAmount,
      Frequency: b.frequency || 'N/A',
    }))
    exportToCSV(data, 'budgets-export')
    toast.success('Budgets exported successfully')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Set spending limits and track your progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!budgets || budgets.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Create Budget
          </Button>
        </div>
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
          setIsFormOpen(open)
          if (!open) setEditingBudget(null)
        }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
