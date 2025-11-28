'use client';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { SpendingTrendsChart } from '@/components/dashboard/SpendingTrendsChart';
import { CategoryBreakdownChart } from '@/components/dashboard/CategoryBreakdownChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Wallet, ArrowDownCircle, ArrowUpCircle, PiggyBank } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Balance"
          value="$12,450.00"
          icon={Wallet}
          trend={{ value: 12.5, label: 'from last month' }}
          delay={0}
        />
        <StatsCard
          title="Total Income"
          value="$4,250.00"
          icon={ArrowUpCircle}
          trend={{ value: 8.2, label: 'from last month' }}
          delay={0.1}
        />
        <StatsCard
          title="Total Expenses"
          value="$2,150.00"
          icon={ArrowDownCircle}
          trend={{ value: -5.4, label: 'from last month' }}
          delay={0.2}
        />
        <StatsCard
          title="Total Savings"
          value="$2,100.00"
          icon={PiggyBank}
          trend={{ value: 15.3, label: 'from last month' }}
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SpendingTrendsChart />
        <CategoryBreakdownChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentTransactions />
        <QuickActions />
      </div>
    </div>
  );
}
