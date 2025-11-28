'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingBag, Coffee, Car, Home, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const transactions = [
    {
        id: 1,
        description: 'Grocery Shopping',
        amount: -120.50,
        date: 'Today, 2:30 PM',
        category: 'Food',
        icon: ShoppingBag,
        color: 'bg-purple-500/10 text-purple-500',
    },
    {
        id: 2,
        description: 'Uber Ride',
        amount: -24.00,
        date: 'Yesterday, 8:15 PM',
        category: 'Transport',
        icon: Car,
        color: 'bg-blue-500/10 text-blue-500',
    },
    {
        id: 3,
        description: 'Freelance Payment',
        amount: 1250.00,
        date: 'Yesterday, 10:00 AM',
        category: 'Income',
        icon: Home,
        color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
        id: 4,
        description: 'Coffee Shop',
        amount: -5.40,
        date: 'Nov 26, 9:45 AM',
        category: 'Food',
        icon: Coffee,
        color: 'bg-amber-500/10 text-amber-500',
    },
    {
        id: 5,
        description: 'Electric Bill',
        amount: -85.00,
        date: 'Nov 25, 11:30 AM',
        category: 'Bills',
        icon: Zap,
        color: 'bg-rose-500/10 text-rose-500',
    },
];

export function RecentTransactions() {
    return (
        <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/transactions">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${transaction.color}`}>
                                    <transaction.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">
                                        {transaction.description}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {transaction.category} • {transaction.date}
                                    </p>
                                </div>
                            </div>
                            <div className={`font-medium ${transaction.amount > 0 ? 'text-emerald-500' : ''}`}>
                                {transaction.amount > 0 ? '+' : ''}
                                ${Math.abs(transaction.amount).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
