'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
import { CreateGoalData, Goal } from '@/lib/api/goals'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const goalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  targetAmount: z.coerce
    .number()
    .min(0.01, 'Target amount must be greater than 0'),
  targetDate: z.string().optional(),
})

type GoalFormValues = z.infer<typeof goalSchema>

interface GoalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateGoalData) => void
  initialData?: Goal | null
  isLoading?: boolean
}

export function GoalForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: GoalFormProps) {
  const form = useForm<GoalFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(goalSchema) as any,
    defaultValues: {
      name: '',
      targetAmount: 0,
      targetDate: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          targetAmount: initialData.targetAmount,
          targetDate: initialData.targetDate
            ? initialData.targetDate.split('T')[0]
            : '',
        })
      } else {
        form.reset({
          name: '',
          targetAmount: 0,
          targetDate: '',
        })
      }
    }
  }, [open, initialData, form])

  const handleSubmit = (values: GoalFormValues) => {
    onSubmit({
      ...values,
      targetDate: values.targetDate ? new Date(values.targetDate) : undefined,
    })
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Goal' : 'Create Goal'}
      description={
        initialData
          ? 'Update the details of your savings goal.'
          : 'Set a new savings goal to track your progress.'
      }
    >
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Name</FormLabel>
                <FormControl>
                  <Input placeholder="New Car, Vacation..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Amount</FormLabel>
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
            name="targetDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  )
}
