'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCategories } from '@/lib/hooks/useCategories'
import { useCurrency } from '@/lib/hooks/useCurrency'
import {
  useDeleteRecurringTransaction,
  useRecurringTransactions,
} from '@/lib/hooks/useRecurringTransactions'
import { format } from 'date-fns'
import { AlertCircle, Loader2, Trash2 } from 'lucide-react'

export function RecurringTransactionsList() {
  const { data: transactions, isLoading, error } = useRecurringTransactions()
  const { data: categories } = useCategories()
  const { format: formatCurrency } = useCurrency()
  const deleteMutation = useDeleteRecurringTransaction()

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const handleDelete = async (id: string) => {
    if (
      confirm('Are you sure you want to delete this recurring transaction?')
    ) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recurring Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load recurring transactions.
        </AlertDescription>
      </Alert>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recurring Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-6 text-center">
            No recurring transactions found.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.description}
                </TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{transaction.frequency}</Badge>
                </TableCell>
                <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>
                <TableCell>
                  {format(new Date(transaction.startDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.nextRunDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void handleDelete(transaction.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="text-destructive h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
