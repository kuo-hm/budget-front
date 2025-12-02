"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget, CreateBudgetData, Frequency } from "@/lib/api/budgets";
import { CategorySelect } from "@/components/categories/CategorySelect";

const budgetSchema = z
  .object({
    limitAmount: z.coerce.number().min(0.01, "Limit must be greater than 0"),
    categoryId: z.string().min(1, "Category is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    frequency: z.nativeEnum(Frequency).optional(),
  })
  .refine(
    (data) => {
      if (!data.frequency) {
        return !!data.endDate && data.endDate.length > 0;
      }
      return true;
    },
    {
      message: "End date is required for one-time budgets",
      path: ["endDate"],
    }
  );

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBudgetData) => void;
  initialData?: Budget | null;
  isLoading?: boolean;
}

export function BudgetForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      limitAmount: 0,
      categoryId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      frequency: undefined,
    },
  });

  const frequency = form.watch("frequency");

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          limitAmount: initialData.limitAmount,
          categoryId: initialData.categoryId,
          startDate: initialData.startDate.split("T")[0],
          endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
          frequency: initialData.frequency || undefined,
        });
      } else {
        // Set default start date to first day of current month and end date to last day
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        form.reset({
          limitAmount: 0,
          categoryId: "",
          startDate: firstDay.toISOString().split("T")[0],
          endDate: lastDay.toISOString().split("T")[0],
          frequency: undefined,
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: BudgetFormValues) => {
    // If frequency is set, endDate is optional, but API might expect it to be undefined or null if not provided
    // Our DTO says optional string.
    onSubmit(values);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Budget" : "Create Budget"}
      description={
        initialData
          ? "Update your spending limit for this category."
          : "Set a spending limit for a specific category to track your expenses."
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <CategorySelect
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Select category"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="limitAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limit Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency (Optional)</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value === "NONE" ? undefined : value);
                  }}
                  value={field.value || "NONE"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NONE">One-time</SelectItem>
                    <SelectItem value={Frequency.DAILY}>Daily</SelectItem>
                    <SelectItem value={Frequency.WEEKLY}>Weekly</SelectItem>
                    <SelectItem value={Frequency.MONTHLY}>Monthly</SelectItem>
                    <SelectItem value={Frequency.YEARLY}>Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    End Date {frequency ? "(Optional)" : ""}
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
