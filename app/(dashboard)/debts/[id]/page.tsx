"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebt, useDeleteDebt } from "@/lib/hooks/useDebts";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PayoffCalculator } from "@/components/debts/PayoffCalculator";
import { PaymentHistory } from "@/components/debts/PaymentHistory";
import { AddPaymentDialog } from "@/components/debts/AddPaymentDialog";
import { DebtForm } from "@/components/debts/DebtForm";

export default function DebtDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: debt, isLoading } = useDebt(resolvedParams.id);
  const { mutate: deleteDebt, isPending: isDeleting } = useDeleteDebt();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (isLoading) {
    return <div className="p-8">Loading debt details...</div>;
  }

  if (!debt) {
    return <div className="p-8">Debt not found</div>;
  }

  const handleDelete = () => {
    deleteDebt(debt.id, {
      onSuccess: () => {
        router.push("/debts");
      },
    });
  };

  const progress = debt.principalAmount > 0
    ? ((debt.principalAmount - debt.currentBalance) / debt.principalAmount) * 100
    : 0;

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{debt.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="capitalize">{debt.type.replace("_", " ").toLowerCase()}</span>
              <span>•</span>
              <span>{debt.interestRate}% APR</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this debt and all its payment history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-4xl font-bold">{formatCurrency(debt.currentBalance)}</p>
          </div>
          <div className="text-right">
             <p className="text-sm text-muted-foreground">Original Principal</p>
             <p className="font-medium">{formatCurrency(debt.principalAmount)}</p>
          </div>
        </div>
        <Progress value={progress} className="h-4 w-full" />
        <p className="text-sm text-right text-muted-foreground">
          {progress.toFixed(1)}% paid off
        </p>
      </div>

      {/* Payoff Calculator Summary */}
      <PayoffCalculator debtId={debt.id} />

      {/* Payment History & Actions */}
      <div className="flex justify-between items-center pt-4">
        <h2 className="text-2xl font-bold">Payments</h2>
        <Button onClick={() => setIsPaymentOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>
      
      <PaymentHistory debtId={debt.id} />

      {/* Dialogs */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Debt</DialogTitle>
            <DialogDescription>Make changes to your debt details.</DialogDescription>
          </DialogHeader>
          <DebtForm debt={debt} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <AddPaymentDialog 
        debtId={debt.id} 
        isOpen={isPaymentOpen} 
        onOpenChange={setIsPaymentOpen}
      />
    </div>
  );
}
