'use client'

import { AvatarUpload } from '@/components/settings/AvatarUpload'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Skeleton } from '@/components/ui/skeleton'
import { currencies } from '@/lib/constants/currencies'
import { useUpdateProfile, useUserProfile } from '@/lib/hooks/useUser'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  baseCurrency: z.string().min(3, {
    message: 'Please select a currency.',
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { data: user, isLoading } = useUserProfile()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      baseCurrency: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.user.name,
        baseCurrency: user.user.baseCurrency || 'USD',
      })
    }
  }, [user, form])

  function onSubmit(data: ProfileFormValues) {
    updateProfile(
      {
        name: data.name,
        baseCurrency: data.baseCurrency,
      },
      {
        onError: (error: unknown) => {
          console.error('Profile update error:', error)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-destructive/10 text-destructive rounded-md p-4">
        Failed to load profile data. Please try refreshing the page.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-x-6">
        <AvatarUpload
          currentAvatarUrl={user.user.avatar}
          name={user.user.name}
          onUploadSuccess={() => {
            void queryClient.invalidateQueries({ queryKey: ['userProfile'] })
          }}
        />
        <div>
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-muted-foreground text-sm">
            Click, drag and drop, or paste an image to upload.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseCurrency"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Currency</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[240px] justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? currencies.find(
                              (currency) => currency.code === field.value,
                            )?.code
                          : 'Select currency'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0">
                    <Command>
                      <CommandInput placeholder="Search currency..." />
                      <CommandList>
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                          {currencies.map((currency) => (
                            <CommandItem
                              value={currency.name}
                              key={currency.code}
                              onSelect={() => {
                                form.setValue('baseCurrency', currency.code)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  currency.code === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {currency.code} - {currency.name} (
                              {currency.symbol})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This currency will be used for all your budgets and
                  transactions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  )
}
