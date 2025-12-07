'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { useCategories, useCreateCategory } from '@/lib/hooks/useCategories'
import { CategoryForm, CategoryFormValues } from './CategoryForm'

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
  type?: 'INCOME' | 'EXPENSE' | 'SAVING'
  placeholder?: string
  disabled?: boolean
}

export function CategorySelect({
  value,
  onChange,
  type,
  placeholder = 'Select category',
  disabled,
}: CategorySelectProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { data: categories, isLoading: isLoadingCategories } = useCategories()
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()

  const filteredCategories = categories?.filter((c) =>
    type ? c.type === type : true,
  )

  const handleCreateCategory = (data: CategoryFormValues) => {
    createCategory(
      {
        ...data,
        type: data.type, // Ensure type is passed correctly
      },
      {
        onSuccess: (newCategory) => {
          setIsCreateOpen(false)
          onChange(newCategory.id)
        },
      },
    )
  }

  return (
    <>
      <Select
        value={value}
        onValueChange={(val) => {
          if (val === 'create_new') {
            setIsCreateOpen(true)
          } else {
            onChange(val)
          }
        }}
        disabled={disabled || isLoadingCategories}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="create_new"
            className="text-muted-foreground focus:text-primary cursor-pointer"
          >
            <div className="flex items-center font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Create new category
            </div>
          </SelectItem>
          {filteredCategories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
          {filteredCategories?.length === 0 && (
            <div className="text-muted-foreground p-2 text-center text-sm">
              No categories found
            </div>
          )}
        </SelectContent>
      </Select>

      <CategoryForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateCategory}
        isLoading={isCreating}
        defaultType={type}
      />
    </>
  )
}
