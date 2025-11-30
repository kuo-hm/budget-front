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
import { Budget, CreateBudgetData } from "@/lib/api/budgets";
import { useCategories } from "@/lib/hooks/useCategories";

const budgetSchema = z.object({
  limitAmount: z.coerce.number().min(0.01, "Limit must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

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
  const { data: categories } = useCategories();

  const form = useForm<BudgetFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      limitAmount: 0,
      categoryId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          limitAmount: initialData.limitAmount,
          categoryId: initialData.categoryId,
          startDate: initialData.startDate.split("T")[0],
          endDate: initialData.endDate.split("T")[0],
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
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: BudgetFormValues) => {
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <FormLabel>End Date</FormLabel>
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
