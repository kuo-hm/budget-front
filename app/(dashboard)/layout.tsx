'use client'

import { BudgetForm } from '@/components/budgets/BudgetForm'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { GoalForm } from '@/components/goals/GoalForm'
import { RecurringTransactionForm } from '@/components/recurring/RecurringTransactionForm'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { CreateBudgetData } from '@/lib/api/budgets'
import { CreateCategoryData } from '@/lib/api/categories'
import { CreateGoalData } from '@/lib/api/goals'
import { CreateRecurringTransactionData } from '@/lib/api/recurring-transactions'
import { CreateTransactionData } from '@/lib/api/transactions'
import { useCreateBudget } from '@/lib/hooks/useBudgets'
import { useCreateCategory } from '@/lib/hooks/useCategories'
import { useCreateGoal } from '@/lib/hooks/useGoals'
import { useCreateRecurringTransaction } from '@/lib/hooks/useRecurringTransactions'
import { useCreateTransaction } from '@/lib/hooks/useTransactions'
import { isAxiosError } from 'axios'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Global Modal States
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [isBudgetOpen, setIsBudgetOpen] = useState(false)
  const [isGoalOpen, setIsGoalOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isRecurringTransactionOpen, setIsRecurringTransactionOpen] =
    useState(false)

  // Mutations
  const createTransactionMutation = useCreateTransaction()
  const createBudgetMutation = useCreateBudget()
  const createGoalMutation = useCreateGoal()
  const createCategoryMutation = useCreateCategory()
  const createRecurringTransactionMutation = useCreateRecurringTransaction()

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false)
  }, [pathname])

  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Overview'
    if (path.includes('/transactions')) return 'Transactions'
    if (path.includes('/budgets')) return 'Budgets'
    if (path.includes('/goals')) return 'Goals'
    if (path.includes('/analytics')) return 'Analytics'
    return 'Dashboard'
  }

  // Handlers
  const handleCreateTransaction = async (data: CreateTransactionData) => {
    try {
      await createTransactionMutation.mutateAsync(data)
      toast.success('Transaction created successfully')
      setIsTransactionOpen(false)
    } catch {
      toast.error('Failed to create transaction')
    }
  }

  const handleCreateRecurringTransaction = async (
    data: CreateRecurringTransactionData,
  ) => {
    try {
      await createRecurringTransactionMutation.mutateAsync(data)
      toast.success('Recurring transaction scheduled successfully')
      setIsRecurringTransactionOpen(false)
    } catch {
      toast.error('Failed to create recurring transaction')
    }
  }

  const handleCreateBudget = async (data: CreateBudgetData) => {
    try {
      await createBudgetMutation.mutateAsync(data)
      toast.success('Budget created successfully')
      setIsBudgetOpen(false)
    } catch {
      toast.error('Failed to create budget')
    }
  }

  const handleCreateGoal = async (data: CreateGoalData) => {
    try {
      await createGoalMutation.mutateAsync(data)
      toast.success('Goal created successfully')
      setIsGoalOpen(false)
    } catch {
      toast.error('Failed to create goal')
    }
  }

  const handleCreateCategory = async (data: CreateCategoryData) => {
    try {
      await createCategoryMutation.mutateAsync(data)
      toast.success('Category created successfully')
      setIsCategoryOpen(false)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error('Category already exists')
      } else {
        toast.error('Failed to create category')
      }
    }
  }

  return (
    <div className="bg-background flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 z-40 hidden w-64 md:block">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out md:pl-64">
        <Header
          onMenuClick={() => setIsMobileMenuOpen(true)}
          title={getPageTitle(pathname)}
          onAddTransaction={() => setIsTransactionOpen(true)}
          onCreateBudget={() => setIsBudgetOpen(true)}
          onSetGoal={() => setIsGoalOpen(true)}
          onCreateCategory={() => setIsCategoryOpen(true)}
          onAddRecurringTransaction={() => setIsRecurringTransactionOpen(true)}
        />
        <main
          id="main-content"
          className="flex-1 overflow-x-hidden p-4 md:p-6"
          tabIndex={-1}
        >
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <TransactionForm
        open={isTransactionOpen}
        onOpenChange={setIsTransactionOpen}
        onSubmit={handleCreateTransaction}
        isLoading={
          createTransactionMutation.isPending ||
          createRecurringTransactionMutation.isPending
        }
      />
      <RecurringTransactionForm
        open={isRecurringTransactionOpen}
        onOpenChange={setIsRecurringTransactionOpen}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleCreateRecurringTransaction}
        isLoading={createRecurringTransactionMutation.isPending}
      />
      <BudgetForm
        open={isBudgetOpen}
        onOpenChange={setIsBudgetOpen}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleCreateBudget}
        isLoading={createBudgetMutation.isPending}
      />
      <GoalForm
        open={isGoalOpen}
        onOpenChange={setIsGoalOpen}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleCreateGoal}
        isLoading={createGoalMutation.isPending}
      />
      <CategoryForm
        open={isCategoryOpen}
        onOpenChange={setIsCategoryOpen}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleCreateCategory}
        isLoading={createCategoryMutation.isPending}
      />
    </div>
  )
}
