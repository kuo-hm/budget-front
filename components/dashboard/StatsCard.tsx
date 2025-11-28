'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
    };
    delay?: number;
}

export function StatsCard({ title, value, icon: Icon, trend, delay = 0 }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    {trend && (
                        <div className="flex items-center mt-1 text-xs">
                            <span
                                className={cn(
                                    "flex items-center font-medium",
                                    trend.value >= 0 ? "text-emerald-500" : "text-rose-500"
                                )}
                            >
                                {trend.value >= 0 ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-muted-foreground ml-1">
                                {trend.label}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
