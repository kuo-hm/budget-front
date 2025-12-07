'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar' // Ensure this component exists, or use native date input if preferred/simpler
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Debt, DebtType, PaymentFrequency } from '@/lib/api/debts'
import { useCreateDebt, useUpdateDebt } from '@/lib/hooks/useDebts'
import { cn } from '@/lib/utils'

const debtFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(DebtType),
  principalAmount: z.coerce.number().min(0, 'Amount must be positive'),
  currentBalance: z.coerce.number().min(0, 'Balance must be positive'),
  interestRate: z.coerce.number().min(0, 'Interest rate must be positive'),
  minimumPayment: z.coerce.number().min(0, 'Payment must be positive'),
  paymentFrequency: z.nativeEnum(PaymentFrequency),
  startDate: z.date(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
})

type DebtFormValues = z.infer<typeof debtFormSchema>

interface DebtFormProps {
  debt?: Debt
  onSuccess?: () => void
}

export function DebtForm({ debt, onSuccess }: DebtFormProps) {
  const { mutate: createDebt, isPending: isCreating } = useCreateDebt()
  const { mutate: updateDebt, isPending: isUpdating } = useUpdateDebt()

  const isEditing = !!debt
  const isPending = isCreating || isUpdating

  const form = useForm<DebtFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(debtFormSchema) as any,
    defaultValues: {
      name: debt?.name || '',
      type: debt?.type || DebtType.CREDIT_CARD,
      principalAmount: debt?.principalAmount || 0,
      currentBalance: debt?.currentBalance || 0,
      interestRate: debt?.interestRate || 0,
      minimumPayment: debt?.minimumPayment || 0,
      paymentFrequency: debt?.paymentFrequency || PaymentFrequency.MONTHLY,
      startDate: debt?.startDate ? new Date(debt.startDate) : new Date(),
      endDate: debt?.endDate ? new Date(debt.endDate) : undefined,
      notes: debt?.notes || '',
    },
  })

  function onSubmit(data: DebtFormValues) {
    const formattedData = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate?.toISOString(),
    }

    if (isEditing && debt) {
      updateDebt({ id: debt.id, data: formattedData }, { onSuccess })
    } else {
      createDebt(formattedData, { onSuccess })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Chase Sapphire" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(DebtType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
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
            name="paymentFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PaymentFrequency).map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="principalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Principal</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Balance</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimumPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Payment</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
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
                      date > new Date() || date < new Date('1900-01-01')
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add some notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Debt' : 'Create Debt'}
        </Button>
      </form>
    </Form>
  )
}
