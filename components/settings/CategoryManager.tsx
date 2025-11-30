"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Tag,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Heart,
  Plane,
  Gamepad2,
  GraduationCap,
  Gift,
  Briefcase,
  Zap,
  Wallet,
  CreditCard,
  Banknote,
  ShoppingBag,
  Bus,
  Coffee,
  Pizza,
  Activity,
  Map,
  Tv,
  MoreHorizontal,
  Smartphone,
  Wifi,
  Music,
  Film,
  Dumbbell,
  Stethoscope,
  Baby,
  Dog,
  Cat,
  Hammer,
  Wrench,
  Book,
  Pen,
  Smile,
  LucideIcon,
} from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/lib/hooks/useCategories";
import { Category } from "@/lib/api/categories";
import {
  CategoryForm,
  CategoryFormValues,
} from "@/components/categories/CategoryForm";

// Map of icon names to Lucide components (duplicated for display purposes, could be shared)
const iconMap: Record<string, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  home: Home,
  car: Car,
  utensils: Utensils,
  heart: Heart,
  plane: Plane,
  gamepad: Gamepad2,
  school: GraduationCap,
  gift: Gift,
  briefcase: Briefcase,
  zap: Zap,
  wallet: Wallet,
  "credit-card": CreditCard,
  banknote: Banknote,
  "shopping-bag": ShoppingBag,
  bus: Bus,
  coffee: Coffee,
  pizza: Pizza,
  activity: Activity,
  map: Map,
  tv: Tv,
  smartphone: Smartphone,
  wifi: Wifi,
  music: Music,
  film: Film,
  dumbbell: Dumbbell,
  stethoscope: Stethoscope,
  baby: Baby,
  dog: Dog,
  cat: Cat,
  hammer: Hammer,
  wrench: Wrench,
  book: Book,
  pen: Pen,
  smile: Smile,
  other: MoreHorizontal,
};

export function CategoryManager() {
  const {
    data: categories,
    isLoading,
    error: categoriesError,
  } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory(null);
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory(
        { id: editingCategory.id, data },
        {
          onSuccess: () => setIsDialogOpen(false),
        }
      );
    } else {
      createCategory(data, {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  const groupedCategories = categories?.reduce((acc, category) => {
    const type = category.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="p-8 rounded-md bg-destructive/10 text-destructive text-center">
        Failed to load categories. Please try refreshing the page.
      </div>
    );
  }

  const renderIcon = (iconName?: string, className?: string) => {
    const IconComponent = iconMap[iconName || "other"] || MoreHorizontal;
    return <IconComponent className={className} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Categories</h3>
          <p className="text-sm text-muted-foreground">
            Manage your transaction categories.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={onSubmit}
        initialData={editingCategory}
        isLoading={isCreating || isUpdating}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {["INCOME", "EXPENSE", "SAVING"].map((type) => (
          <Card key={type} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4" />
                {type.charAt(0) + type.slice(1).toLowerCase()}s
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {groupedCategories?.[type]?.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {renderIcon(category.icon, "h-4 w-4")}
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Transactions
                            associated with this category might lose their
                            categorization.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCategory(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              {(!groupedCategories?.[type] ||
                groupedCategories[type].length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No categories found.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
