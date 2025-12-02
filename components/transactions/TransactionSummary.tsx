"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TransactionSummary as SummaryType,
  transactionsApi,
} from "@/lib/api/transactions";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { TRANSACTION_KEYS } from "@/lib/hooks/useTransactions";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface TransactionSummaryProps {
  startDate?: string;
  endDate?: string;
}

export function TransactionSummary({
  startDate,
  endDate,
}: TransactionSummaryProps) {
  const { format, isLoading: isCurrencyLoading } = useCurrency();
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: TRANSACTION_KEYS.summary(startDate || "", endDate || ""),
    queryFn: () => {
      // Default to current month if no dates provided
      const start =
        startDate ||
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString();
      const end = endDate || new Date().toISOString();
      return transactionsApi.getSummary(start, end);
    },
  });

  const isLoading = isSummaryLoading || isCurrencyLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-20" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              <div className="text-2xl font-bold text-emerald-500">
                {format(summary?.totalIncome || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Total Expenses
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              <div className="text-2xl font-bold text-rose-500">
                {format(summary?.totalExpense || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total Savings</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              <div className="text-2xl font-bold text-blue-500">
                {format(summary?.totalSaving || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Net Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${(summary?.netBalance || 0) >= 0
                ? "text-emerald-500"
                : "text-rose-500"
                }`}
            >
              {format(summary?.netBalance || 0)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
