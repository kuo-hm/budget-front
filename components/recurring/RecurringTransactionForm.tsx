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
import {
  RecurringTransaction,
  CreateRecurringTransactionData,
} from "@/lib/api/recurring-transactions";
import { CategorySelect } from "@/components/categories/CategorySelect";
import { useCategory } from "@/lib/hooks/useCategories";

const recurringTransactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["INCOME", "EXPENSE", "SAVING"]),
  categoryId: z.string().min(1, "Category is required"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

type RecurringTransactionFormValues = z.infer<
  typeof recurringTransactionSchema
>;

interface RecurringTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRecurringTransactionData) => void;
  initialData?: RecurringTransaction | null;
  isLoading?: boolean;
}

export function RecurringTransactionForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: RecurringTransactionFormProps) {
  const { data: initialCategory } = useCategory(initialData?.categoryId || "");

  const form = useForm<RecurringTransactionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(recurringTransactionSchema) as any,
    defaultValues: {
      amount: 0,
      description: "",
      type: "EXPENSE",
      categoryId: "",
      frequency: "MONTHLY",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    },
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          amount: initialData.amount,
          description: initialData.description || "",
          type: initialCategory?.type || "EXPENSE",
          categoryId: initialData.categoryId,
          frequency: initialData.frequency,
          startDate: initialData.startDate.split("T")[0],
          endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
        });
      } else {
        form.reset({
          amount: 0,
          description: "",
          type: "EXPENSE",
          categoryId: "",
          frequency: "MONTHLY",
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
        });
      }
    }
  }, [open, initialData, form, initialCategory]);

  const handleSubmit = (values: RecurringTransactionFormValues) => {
    // We don't send 'type' to the API
    const { type, ...data } = values;
    onSubmit({
      ...data,
      endDate: data.endDate || undefined,
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        initialData ? "Edit Recurring Transaction" : "Add Recurring Transaction"
      }
      description={
        initialData
          ? "Edit the details of your recurring transaction."
          : "Create a new recurring transaction to track automated expenses or income."
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Rent, Salary, Netflix..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("categoryId", "");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                      <SelectItem value="SAVING">Saving</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <CategorySelect
                  value={field.value || ""}
                  onChange={field.onChange}
                  type={selectedType}
                  placeholder="Select category"
                  disabled={!selectedType}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
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
                  <FormLabel>End Date (Optional)</FormLabel>
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
