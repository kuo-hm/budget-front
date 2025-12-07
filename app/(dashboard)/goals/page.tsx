'use client'

import { GoalForm } from '@/components/goals/GoalForm'
import { GoalList } from '@/components/goals/GoalList'
import { UpdateGoalProgressModal } from '@/components/goals/UpdateGoalProgressModal'
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
import { CreateGoalData, Goal, UpdateGoalProgressData } from '@/lib/api/goals'
import {
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useUpdateGoal,
  useUpdateGoalProgress,
} from '@/lib/hooks/useGoals'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function GoalsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [progressGoal, setProgressGoal] = useState<Goal | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Queries & Mutations
  const { data: goals, isLoading } = useGoals()
  const createMutation = useCreateGoal()
  const updateMutation = useUpdateGoal()
  const updateProgressMutation = useUpdateGoalProgress()
  const deleteMutation = useDeleteGoal()

  // Handlers
  const handleCreate = async (data: CreateGoalData) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('Goal created successfully')
      setIsFormOpen(false)
    } catch {
      toast.error('Failed to create goal')
    }
  }

  const handleUpdate = async (data: CreateGoalData) => {
    if (!editingGoal) return
    try {
      await updateMutation.mutateAsync({
        id: editingGoal.id,
        data: { ...data },
      })
      toast.success('Goal updated successfully')
      setIsFormOpen(false)
      setEditingGoal(null)
    } catch {
      toast.error('Failed to update goal')
    }
  }

  const handleUpdateProgress = async (data: UpdateGoalProgressData) => {
    if (!progressGoal) return
    try {
      await updateProgressMutation.mutateAsync({
        id: progressGoal.id,
        data,
      })
      toast.success('Goal progress updated successfully')
      setIsProgressModalOpen(false)
      setProgressGoal(null)
    } catch {
      toast.error('Failed to update goal progress')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success('Goal deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete goal')
    }
  }

  const openCreateModal = () => {
    setEditingGoal(null)
    setIsFormOpen(true)
  }

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal)
    setIsFormOpen(true)
  }

  const openProgressModal = (goal: Goal) => {
    setProgressGoal(goal)
    setIsProgressModalOpen(true)
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
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">
            Track your savings and reach your financial targets
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </div>

      <GoalList
        goals={goals || []}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={setDeleteId}
        onUpdateProgress={openProgressModal}
      />

      <GoalForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingGoal(null)
        }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={editingGoal ? handleUpdate : handleCreate}
        initialData={editingGoal}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <UpdateGoalProgressModal
        open={isProgressModalOpen}
        onOpenChange={(open) => {
          setIsProgressModalOpen(open)
          if (!open) setProgressGoal(null)
        }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleUpdateProgress}
        goal={progressGoal}
        isLoading={updateProgressMutation.isPending}
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
              goal.
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
