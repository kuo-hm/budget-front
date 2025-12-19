'use client'

import { cn } from '@/lib/utils'
import {
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  Receipt,
  Repeat,
  Target,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Recurring', href: '/recurring-transactions', icon: Repeat },
  { name: 'Budgets', href: '/budgets', icon: PiggyBank },
  { name: 'Debts', href: '/debts', icon: CreditCard },
  // { name: 'Investments', href: '/investments', icon: TrendingUp },
  { name: 'Goals', href: '/goals', icon: Target },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'bg-card border-border flex h-full flex-col border-r',
        className,
      )}
    >
      <div className="p-6">
        <Link
          href="/dashboard"
          className="text-primary flex items-center gap-2 text-xl font-bold"
        >
          <Wallet className="h-6 w-6" />
          <span>BudgetTracker</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
