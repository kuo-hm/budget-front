"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Goal, UpdateGoalProgressData } from "@/lib/api/goals";

const progressSchema = z.object({
  currentSaved: z.coerce.number().min(0, "Amount cannot be negative"),
});

type ProgressFormValues = z.infer<typeof progressSchema>;

interface UpdateGoalProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateGoalProgressData) => void;
  goal: Goal | null;
  isLoading?: boolean;
}

export function UpdateGoalProgressModal({
  open,
  onOpenChange,
  onSubmit,
  goal,
  isLoading,
}: UpdateGoalProgressModalProps) {
  const form = useForm<ProgressFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(progressSchema) as any,
    defaultValues: {
      currentSaved: 0,
    },
  });

  useEffect(() => {
    if (open && goal) {
      form.reset({
        currentSaved: goal.currentSaved,
      });
    }
  }, [open, goal, form]);

  const handleSubmit = (values: ProgressFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            Update the current saved amount for{" "}
            <span className="font-semibold">{goal?.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="currentSaved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Saved Amount</FormLabel>
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
