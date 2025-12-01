"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction } from "@/lib/api/transactions";
import { MoreHorizontal, ArrowUpDown, Trash, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
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
  const { currency: userCurrency } = useCurrency();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(transactions.map((t) => t.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((sid) => sid !== id));
    }
  };

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
                    <Skeleton className="h-4 w-16 ml-auto" />
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
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
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
                  className="p-0 hover:bg-transparent font-medium"
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  data-state={
                    selectedIds.includes(transaction.id) && "selected"
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
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {transaction.category?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-bold",
                      transaction.category?.type === "INCOME"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    )}
                  >
                    {transaction.category?.type === "INCOME" ? "+" : "-"}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: transaction.currency || userCurrency,
                    }).format(transaction.amount)}
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
          <div className="text-sm text-muted-foreground">
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
  );
}
