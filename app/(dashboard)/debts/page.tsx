'use client'

import { DebtForm } from '@/components/debts/DebtForm'
import { AnimatedCard } from '@/components/shared/AnimatedCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { DebtType } from '@/lib/api/debts'
import { useDebts } from '@/lib/hooks/useDebts'
import { formatCurrency } from '@/lib/utils'
import { AlertCircle, Banknote, Building, CreditCard, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function DebtsPage() {
  const { data: debts, isLoading } = useDebts()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Calculate totals
  const totalDebt =
    debts?.reduce((acc, debt) => acc + debt.currentBalance, 0) || 0
  const totalMonthlyPayment =
    debts?.reduce((acc, debt) => acc + debt.minimumPayment, 0) || 0
  const avgInterestRate =
    debts && debts.length > 0
      ? debts.reduce((acc, debt) => acc + debt.interestRate, 0) / debts.length
      : 0

  const getDebtIcon = (type: DebtType) => {
    switch (type) {
      case DebtType.CREDIT_CARD:
        return CreditCard
      case DebtType.LOAN:
        return Banknote
      case DebtType.MORTGAGE:
        return Building
      default:
        return AlertCircle
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading debts...</div>
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debt Management</h1>
          <p className="text-muted-foreground">
            Track your debts and plan your payoff journey.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
              <DialogDescription>
                Enter the details of your debt to start tracking it.
              </DialogDescription>
            </DialogHeader>
            <DebtForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <AnimatedCard>
          <div className="p-6">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Total Debt
            </h3>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(totalDebt)}
            </div>
            <p className="text-muted-foreground text-xs">
              Across {debts?.length || 0} accounts
            </p>
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <div className="p-6">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Monthly Obligation
            </h3>
            <div className="text-2xl font-bold">
              {formatCurrency(totalMonthlyPayment)}
            </div>
            <p className="text-muted-foreground text-xs">
              Total minimum payments
            </p>
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <div className="p-6">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Avg. Interest Rate
            </h3>
            <div className="text-2xl font-bold text-orange-500">
              {avgInterestRate.toFixed(2)}%
            </div>
            <p className="text-muted-foreground text-xs">
              Weighted average APR
            </p>
          </div>
        </AnimatedCard>
      </div>

      {/* Debt List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {debts?.map((debt, index) => {
          const Icon = getDebtIcon(debt.type)
          const progress =
            debt.principalAmount > 0
              ? ((debt.principalAmount - debt.currentBalance) /
                  debt.principalAmount) *
                100
              : 0

          return (
            <Link
              href={`/debts/${debt.id}`}
              key={debt.id}
              className="group block"
            >
              <AnimatedCard
                delay={index * 0.1}
                className="hover:border-primary/50 h-full transition-colors"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 text-primary rounded-full p-2">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary font-semibold transition-colors">
                          {debt.name}
                        </h3>
                        <p className="text-muted-foreground text-sm capitalize">
                          {debt.type.replace('_', ' ').toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {formatCurrency(debt.currentBalance)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        of {formatCurrency(debt.principalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Interest Rate</p>
                        <p className="font-medium">{debt.interestRate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Min Payment</p>
                        <p className="font-medium">
                          {formatCurrency(debt.minimumPayment)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </Link>
          )
        })}

        {debts?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-3">
              <Banknote className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">No debts tracked</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Add your loans, credit cards, or mortgages to start tracking your
              payoff progress.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Debt
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
