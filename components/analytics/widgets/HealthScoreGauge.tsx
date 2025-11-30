"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthScore } from "@/lib/api/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface HealthScoreGaugeProps {
  data?: HealthScore;
  isLoading: boolean;
}

export function HealthScoreGauge({ data, isLoading }: HealthScoreGaugeProps) {
  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />;
  }

  if (!data) return null;

  const getColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const color = getColor(data.score);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Health Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center">
            <svg className="h-40 w-40 transform -rotate-90">
              <circle
                className="text-muted/20"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
              />
              <circle
                className={cn("transition-all duration-1000 ease-out", color)}
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - data.score / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={cn("text-4xl font-bold", color)}>
                {data.score}
              </span>
              <span className="text-sm text-muted-foreground">
                {data.status}
              </span>
            </div>
          </div>

          <div className="w-full space-y-2">
            {Array.isArray(data.factors) &&
              data.factors.map((factor, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  {factor.impact === "POSITIVE" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                  )}
                  <div>
                    <p className="font-medium">{factor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {factor.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
