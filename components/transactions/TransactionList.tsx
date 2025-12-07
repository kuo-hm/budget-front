'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Transaction } from '@/lib/api/transactions'
import { useCurrency } from '@/lib/hooks/useCurrency'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Upload } from 'lucide-react'
import { useState } from 'react'
import { ReceiptUpload } from './ReceiptUpload'
import { ReceiptViewer } from './ReceiptViewer'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export function TransactionList({
  transactions,
  isLoading,
  meta,
  onPageChange,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: TransactionListProps) {
  const { currency: userCurrency } = useCurrency()
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)

  // Mock receipt data store (simulated backend)
  const [receipts, setReceipts] = useState<Record<string, string>>({})

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(transactions.map((t) => t.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter((sid) => sid !== id))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUploadReceipt = async (_file: File) => {
    if (selectedTransactionId) {
      // Mock upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store mock receipt (using a placeholder image for demo)
      const mockUrl =
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000'
      setReceipts((prev) => ({
        ...prev,
        [selectedTransactionId]: mockUrl,
      }))

      setIsReceiptDialogOpen(false)
    }
  }

  const handleDeleteReceipt = async () => {
    if (selectedTransactionId) {
      // Mock delete delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setReceipts((prev) => {
        const newReceipts = { ...prev }
        delete newReceipts[selectedTransactionId]
        return newReceipts
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      transactions.length > 0 &&
                      selectedIds.length === transactions.length
                    }
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[150px]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium hover:bg-transparent"
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    data-state={
                      selectedIds.includes(transaction.id) && 'selected'
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(transaction.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(transaction.id, !!checked)
                        }
                        aria-label="Select row"
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description || '-'}
                    </TableCell>
                    <TableCell>
                      <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                        {transaction.category?.name || 'Uncategorized'}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-bold',
                        transaction.category?.type === 'INCOME'
                          ? 'text-emerald-500'
                          : 'text-rose-500',
                      )}
                    >
                      {transaction.category?.type === 'INCOME' ? '+' : '-'}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: transaction.currency || userCurrency,
                      }).format(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {receipts[transaction.id] ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary h-8 w-8"
                          onClick={() => {
                            setSelectedTransactionId(transaction.id)
                            setIsReceiptDialogOpen(true)
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onEdit(transaction)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTransactionId(transaction.id)
                              setIsReceiptDialogOpen(true)
                            }}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {receipts[transaction.id]
                              ? 'Manage Receipt'
                              : 'Upload Receipt'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(transaction.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
            >
              Previous
            </Button>
            <div className="text-muted-foreground text-sm">
              Page {meta.page} of {meta.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receipt Management</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedTransactionId && receipts[selectedTransactionId] ? (
              <ReceiptViewer
                receiptUrl={receipts[selectedTransactionId]}
                receiptType="image"
                transactionId={selectedTransactionId}
                onDelete={handleDeleteReceipt}
              />
            ) : (
              <ReceiptUpload
                onUpload={handleUploadReceipt}
                transactionId={selectedTransactionId || ''}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
