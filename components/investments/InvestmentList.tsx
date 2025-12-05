"use client";

import { useInvestments, useDeleteInvestment } from "@/lib/hooks/useInvestments";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface InvestmentListProps {
  onEdit: (id: string) => void;
}

export function InvestmentList({ onEdit }: InvestmentListProps) {
  const { data: investments, isLoading } = useInvestments();
  const { mutate: deleteInvestment, isPending: isDeleting } = useDeleteInvestment();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!investments || investments.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-semibold">No investments yet</h3>
        <p className="text-muted-foreground">
          Start building your portfolio by adding your first asset.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Holdings</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Gain/Loss</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => {
            const currentValue = investment.currentValue || (investment.quantity * investment.purchasePrice);
            const gainLoss = investment.gainLoss || 0;
            const gainLossPercent = investment.gainLossPercent || 0;
            const isPositive = gainLoss >= 0;

            return (
              <TableRow key={investment.id}>
                <TableCell>
                  <div className="font-medium">{investment.name}</div>
                  <div className="text-xs text-muted-foreground">{investment.symbol}</div>
                </TableCell>
                <TableCell className="capitalize">{investment.type}</TableCell>
                <TableCell className="text-right">
                  {investment.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(investment.currentPrice || investment.purchasePrice)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(currentValue)}
                </TableCell>
                <TableCell className={cn("text-right", isPositive ? "text-green-600" : "text-red-600")}>
                  <div>{isPositive ? "+" : ""}{formatCurrency(gainLoss)}</div>
                  <div className="text-xs">
                    {isPositive ? "+" : ""}{gainLossPercent.toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(investment.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this investment record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteInvestment(investment.id)}
                            disabled={isDeleting}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
