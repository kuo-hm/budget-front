'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, PiggyBank, Target, FileText } from 'lucide-react';

const actions = [
    {
        label: 'Add Transaction',
        icon: Plus,
        variant: 'default' as const,
    },
    {
        label: 'Create Budget',
        icon: PiggyBank,
        variant: 'outline' as const,
    },
    {
        label: 'Set Goal',
        icon: Target,
        variant: 'outline' as const,
    },
    {
        label: 'Export Report',
        icon: FileText,
        variant: 'outline' as const,
    },
];

export function QuickActions() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            variant={action.variant}
                            className="h-24 flex flex-col gap-2 items-center justify-center text-center"
                        >
                            <action.icon className="h-6 w-6" />
                            {action.label}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
