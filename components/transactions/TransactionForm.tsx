"use client";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CreateTransactionData, Transaction } from "@/lib/api/transactions";
import { useEffect } from "react";
import { useCategories } from "@/lib/hooks/useCategories";

const transactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date(),
  description: z.string().optional(),
  currency: z.string().default("USD"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTransactionData) => Promise<void>;
  initialData?: Transaction | null;
  isLoading?: boolean;
}

export function TransactionForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: TransactionFormProps) {
  const { data: categories } = useCategories();

  const form = useForm<TransactionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      type: "EXPENSE",
      categoryId: "",
      date: new Date(),
      description: "",
      currency: "USD",
    },
  });

  // Watch type to filter categories
  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = form.watch("type");

  const filteredCategories = categories?.filter((c) => c.type === selectedType);

  useEffect(() => {
    if (initialData) {
      form.reset({
        amount: initialData.amount,
        type: (initialData.category?.type as "INCOME" | "EXPENSE") || "EXPENSE",
        categoryId: initialData.categoryId,
        date: new Date(initialData.date),
        description: initialData.description || "",
        currency: initialData.currency || "USD",
      });
    } else {
      form.reset({
        type: "EXPENSE",
        categoryId: "",
        date: new Date(),
        description: "",
        currency: "USD",
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (data: TransactionFormValues) => {
    // We don't send 'type' to the API as it's part of the category
    await onSubmit({
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      date: data.date.toISOString(),
      categoryId: data.categoryId,
    });
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Transaction" : "Add Transaction"}
      description={
        initialData
          ? "Make changes to your transaction here."
          : "Add a new transaction to your records."
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("categoryId", ""); // Reset category when type changes
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCategories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                    {filteredCategories?.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No categories found for {selectedType.toLowerCase()}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Grocery shopping" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
