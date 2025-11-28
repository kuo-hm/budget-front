'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    Target,
    BarChart3,
    LogOut,
    Wallet,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Budgets', href: '/budgets', icon: PiggyBank },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className={cn("flex h-full flex-col bg-card border-r border-border", className)}>
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Wallet className="h-6 w-6" />
                    <span>BudgetTracker</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
