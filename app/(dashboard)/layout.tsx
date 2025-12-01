"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { GoalForm } from "@/components/goals/GoalForm";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { useCreateTransaction } from "@/lib/hooks/useTransactions";
import { useCreateBudget } from "@/lib/hooks/useBudgets";
import { useCreateGoal } from "@/lib/hooks/useGoals";
import { useCreateCategory } from "@/lib/hooks/useCategories";
import { useCreateRecurringTransaction } from "@/lib/hooks/useRecurringTransactions";
import { toast } from "sonner";
import { CreateTransactionData } from "@/lib/api/transactions";
import { CreateBudgetData } from "@/lib/api/budgets";
import { CreateGoalData } from "@/lib/api/goals";
import { CreateCategoryData } from "@/lib/api/categories";
import { CreateRecurringTransactionData } from "@/lib/api/recurring-transactions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Global Modal States
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isRecurringTransactionOpen, setIsRecurringTransactionOpen] =
    useState(false);

  // Mutations
  const createTransactionMutation = useCreateTransaction();
  const createBudgetMutation = useCreateBudget();
  const createGoalMutation = useCreateGoal();
  const createCategoryMutation = useCreateCategory();
  const createRecurringTransactionMutation = useCreateRecurringTransaction();

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getPageTitle = (path: string) => {
    if (path.includes("/dashboard")) return "Overview";
    if (path.includes("/transactions")) return "Transactions";
    if (path.includes("/budgets")) return "Budgets";
    if (path.includes("/goals")) return "Goals";
    if (path.includes("/analytics")) return "Analytics";
    return "Dashboard";
  };

  // Handlers
  const handleCreateTransaction = async (data: CreateTransactionData) => {
    try {
      await createTransactionMutation.mutateAsync(data);
      toast.success("Transaction created successfully");
      setIsTransactionOpen(false);
    } catch (error) {
      toast.error("Failed to create transaction");
    }
  };

  const handleCreateRecurringTransaction = async (
    data: CreateRecurringTransactionData
  ) => {
    try {
      await createRecurringTransactionMutation.mutateAsync(data);
      toast.success("Recurring transaction scheduled successfully");
      setIsRecurringTransactionOpen(false);
    } catch (error) {
      toast.error("Failed to create recurring transaction");
    }
  };

  const handleCreateBudget = async (data: CreateBudgetData) => {
    try {
      await createBudgetMutation.mutateAsync(data);
      toast.success("Budget created successfully");
      setIsBudgetOpen(false);
    } catch (error) {
      toast.error("Failed to create budget");
    }
  };

  const handleCreateGoal = async (data: CreateGoalData) => {
    try {
      await createGoalMutation.mutateAsync(data);
      toast.success("Goal created successfully");
      setIsGoalOpen(false);
    } catch (error) {
      toast.error("Failed to create goal");
    }
  };

  const handleCreateCategory = async (data: CreateCategoryData) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      toast.success("Category created successfully");
      setIsCategoryOpen(false);
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-40">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300 ease-in-out">
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
          className="flex-1 p-4 md:p-6 overflow-x-hidden"
          tabIndex={-1}
        >
          <div className="max-w-7xl mx-auto w-full">{children}</div>
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
        onSubmit={handleCreateRecurringTransaction}
        isLoading={createRecurringTransactionMutation.isPending}
      />
      <BudgetForm
        open={isBudgetOpen}
        onOpenChange={setIsBudgetOpen}
        onSubmit={handleCreateBudget}
        isLoading={createBudgetMutation.isPending}
      />
      <GoalForm
        open={isGoalOpen}
        onOpenChange={setIsGoalOpen}
        onSubmit={handleCreateGoal}
        isLoading={createGoalMutation.isPending}
      />
      <CategoryForm
        open={isCategoryOpen}
        onOpenChange={setIsCategoryOpen}
        onSubmit={handleCreateCategory}
        isLoading={createCategoryMutation.isPending}
      />
    </div>
  );
}
