'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { TransactionFilters as FilterType } from '@/lib/api/transactions'
import { TransactionType } from '@/lib/constants/types'
import { useCategories } from '@/lib/hooks/useCategories'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

interface TransactionFiltersProps {
  filters: FilterType
  onFilterChange: (filters: FilterType) => void
}

export function TransactionFilters({
  filters,
  onFilterChange,
}: TransactionFiltersProps) {
  const { data: categories } = useCategories()
  const [date, setDate] = useState<DateRange | undefined>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  })

  // Debounce search
  const [searchValue, setSearchValue] = useState(filters.search || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = filters.search || ''
      if (searchValue !== currentSearch) {
        onFilterChange({
          ...filters,
          search: searchValue || undefined,
          page: 1,
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchValue, filters, onFilterChange])

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range)
    if (range?.from) {
      onFilterChange({
        ...filters,
        startDate: range.from.toISOString(),
        endDate: range.to?.toISOString(),
        page: 1,
      })
    } else {
      onFilterChange({
        ...filters,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      })
    }
  }

  const clearFilters = () => {
    setSearchValue('')
    setDate(undefined)
    onFilterChange({
      page: 1,
      limit: filters.limit,
    })
  }

  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        <div className="w-full md:w-64">
          <Input
            placeholder="Search transactions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        </div>

        <Select
          value={filters.type || 'all'}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              type: value === 'all' ? undefined : (value as TransactionType),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.categoryId || 'all'}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              categoryId: value === 'all' ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal md:w-[240px]',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {(filters.search ||
        filters.type ||
        filters.categoryId ||
        filters.startDate) && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
