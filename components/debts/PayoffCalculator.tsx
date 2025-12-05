"use client";

import { useDebtPayoffDetails } from "@/lib/hooks/useDebts";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2, TrendingDown, Calendar, DollarSign, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PayoffCalculatorProps {
  debtId: string;
}

export function PayoffCalculator({ debtId }: PayoffCalculatorProps) {
  const { data: details, isLoading } = useDebtPayoffDetails(debtId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payoff Projection</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!details) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payoff Projection</CardTitle>
          <CardDescription>No data available for projection.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Calculate percentage of total payment that goes to interest
  const interestPercentage = details.totalAmount > 0 
    ? (details.totalInterest / details.totalAmount) * 100 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Target Payoff Date</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {details.projectedPayoffDate 
              ? format(new Date(details.projectedPayoffDate), "MMM yyyy")
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {details.monthsRemaining} months remaining
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Interest</CardTitle>
          <TrendingDown className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(details.totalInterest)}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Progress value={interestPercentage} className="h-1 flex-1 bg-muted" />
            <span className="text-xs text-muted-foreground">{interestPercentage.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            of total repayment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Repayment</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(details.totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            Principal + Interest
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(details.monthlyPayment)}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on current settings
          </p>
        </CardContent>
      </Card>
      
      {/* 
         If paymentSchedule is just a list of strings (dates?), we could list them
         but a chart would be better. For now, the summary cards provide good value.
      */}
    </div>
  );
}
