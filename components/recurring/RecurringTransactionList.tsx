"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, CalendarClock } from "lucide-react";
import { RecurringTransaction } from "@/lib/api/recurring-transactions";
import { format } from "date-fns";
import { useCategories } from "@/lib/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface RecurringTransactionListProps {
  transactions: RecurringTransaction[];
  isLoading: boolean;
  onEdit: (transaction: RecurringTransaction) => void;
  onDelete: (id: string) => void;
}

export function RecurringTransactionList({
  transactions,
  isLoading,
  onEdit,
  onDelete,
}: RecurringTransactionListProps) {
  const { data: categories } = useCategories();
  const { format: formatCurrency } = useCurrency();

  const getCategoryName = (categoryId: string) => {
    return (
      categories?.find((c) => c.id === categoryId)?.name || "Uncategorized"
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
        <CalendarClock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No recurring transactions</h3>
        <p className="text-muted-foreground">
          Set up recurring transactions to track your regular income and
          expenses.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Next Run</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {transaction.description || "No description"}
              </TableCell>
              <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>
              <TableCell className="capitalize">
                {transaction.frequency.toLowerCase()}
              </TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                {format(new Date(transaction.nextRunDate), "MMM d, yyyy")}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
