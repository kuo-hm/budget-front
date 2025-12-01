"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Loader2,
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
import { Category, CreateCategoryData } from "@/lib/api/categories";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["INCOME", "EXPENSE", "SAVING"]),
  icon: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// Map of icon names to Lucide components
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

const iconOptions = Object.keys(iconMap);

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormValues) => void;
  initialData?: Category | null;
  isLoading?: boolean;
  defaultType?: "INCOME" | "EXPENSE" | "SAVING";
}

export function CategoryForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
  defaultType = "EXPENSE",
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      type: defaultType,
      icon: "other",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          type: initialData.type,
          icon: initialData.icon || "other",
        });
      } else {
        form.reset({
          name: "",
          type: defaultType,
          icon: "other",
        });
      }
    }
  }, [initialData, form, open, defaultType]);

  const renderIcon = (iconName?: string, className?: string) => {
    const IconComponent = iconMap[iconName || "other"] || MoreHorizontal;
    return <IconComponent className={className} />;
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Category" : "Add Category"}
      description={
        initialData
          ? "Update the details of your category."
          : "Create a new category for your transactions."
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Groceries" {...field} />
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
                  onValueChange={field.onChange}
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
                    <SelectItem value="SAVING">Saving</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <div className="flex items-center gap-2">
                            {renderIcon(field.value, "h-4 w-4")}
                            <span className="capitalize">
                              {field.value.replace("-", " ")}
                            </span>
                          </div>
                        ) : (
                          "Select icon"
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-2">
                    <div className="grid grid-cols-6 gap-2">
                      {iconOptions.map((icon) => (
                        <Button
                          key={icon}
                          variant="ghost"
                          className={cn(
                            "h-10 w-10 p-0",
                            field.value === icon && "bg-muted"
                          )}
                          onClick={() => {
                            form.setValue("icon", icon);
                          }}
                        >
                          {renderIcon(icon, "h-5 w-5")}
                          <span className="sr-only">{icon}</span>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="mr-2"
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
