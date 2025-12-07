'use client'

import { AllocationChart } from '@/components/investments/AllocationChart'
import { InvestmentForm } from '@/components/investments/InvestmentForm'
import { InvestmentList } from '@/components/investments/InvestmentList'
import { AnimatedCard } from '@/components/shared/AnimatedCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useInvestment, usePortfolioSummary } from '@/lib/hooks/useInvestments'
import { cn, formatCurrency } from '@/lib/utils'
import { DollarSign, PieChart, Plus, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function InvestmentsPage() {
  const { data: summary } = usePortfolioSummary()
  // const { mutate: refreshPrices, isPending: isRefreshing } = useRefreshInvestmentPrices();

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // We need to fetch the investment being edited if editingId is set
  // Ideally this would be handled inside the modal or a wrapper to avoid conditional hook calls
  // asking for "one" when we might just pass data if we had it, but for fresh data let's fetch.
  // We can just pass the ID to the form wrapper or handle fetching there.
  // Simplest is to have a wrapper component or just pass current data if we have it from the list.
  // But standard pattern:

  const handleEdit = (id: string) => {
    setEditingId(id)
    setIsCreateOpen(true)
  }

  const handleClose = () => {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Investment Portfolio
          </h1>
          <p className="text-muted-foreground">
            Track your assets and monitor portfolio performance.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Refresh Button - Assuming backend supports refreshing distinct assets or similar logic */}
          {/* For now, maybe just a global 'refresh queries' or if backend has a trigger */}
          {/* Passed dummy ID for now or we could update endpoint to be general. Let's assume per-item in list, but globally? */}
          {/* Let's skip global refresh button if API expects ID, or make API optional ID. Updated API to allow optional ID. */}
          {/* <Button variant="outline" onClick={() => refreshPrices("")} disabled={isRefreshing}>
             <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
             Refresh Prices
          </Button> */}

          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedCard title="Total Value">
          <div className="text-2xl font-bold">
            {formatCurrency(summary?.totalCurrentValue || 0)}
          </div>
          <p className="text-muted-foreground text-xs">Current market value</p>
          <div className="text-muted-foreground absolute top-4 right-4">
            <DollarSign className="h-4 w-4" />
          </div>
        </AnimatedCard>

        <AnimatedCard title="Total Invested">
          <div className="text-2xl font-bold">
            {formatCurrency(summary?.totalInvested || 0)}
          </div>
          <p className="text-muted-foreground text-xs">Cost basis</p>
          <div className="text-muted-foreground absolute top-4 right-4">
            <PieChart className="h-4 w-4" />
          </div>
        </AnimatedCard>

        <AnimatedCard title="Total Gain/Loss">
          <div
            className={cn(
              'text-2xl font-bold',
              (summary?.totalGainLoss || 0) >= 0
                ? 'text-green-600'
                : 'text-red-600',
            )}
          >
            {summary?.totalGainLoss && summary.totalGainLoss > 0 ? '+' : ''}
            {formatCurrency(summary?.totalGainLoss || 0)}
          </div>
          <p className="text-muted-foreground text-xs">
            {(summary?.totalGainLossPercent || 0) > 0 ? '+' : ''}
            {(summary?.totalGainLossPercent || 0).toFixed(2)}% all time
          </p>
          <div className="text-muted-foreground absolute top-4 right-4">
            <TrendingUp className="h-4 w-4" />
          </div>
        </AnimatedCard>

        <AnimatedCard title="Asset Count">
          <div className="text-2xl font-bold">
            {summary?.investmentCount || 0}
          </div>
          <p className="text-muted-foreground text-xs">Active positions</p>
        </AnimatedCard>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Investment List */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Your Assets</h2>
          <InvestmentList onEdit={handleEdit} />
        </div>

        {/* Allocation Chart */}
        <div className="space-y-4 lg:col-span-1">
          <h2 className="text-xl font-semibold">Allocation</h2>
          <div className="h-[400px]">
            <AllocationChart summary={summary} />
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Investment' : 'Add Investment'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the details of your investment.'
                : 'Enter details for your new asset.'}
            </DialogDescription>
          </DialogHeader>

          {editingId ? (
            <EditInvestmentFormWrapper id={editingId} onSuccess={handleClose} />
          ) : (
            <InvestmentForm onSuccess={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Wrapper to fetch data for editing
function EditInvestmentFormWrapper({
  id,
  onSuccess,
}: {
  id: string
  onSuccess: () => void
}) {
  const { data: investment, isLoading } = useInvestment(id)

  if (isLoading) return <div>Loading...</div>

  return <InvestmentForm investment={investment} onSuccess={onSuccess} />
}
