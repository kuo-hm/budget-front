import { useAuth } from "@/lib/hooks/useAuth";
import { useUserProfile } from "@/lib/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  Plus,
  PiggyBank,
  Target,
  Tag,
  Repeat,
  Blocks,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CurrencySelector } from "./CurrencySelector";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  onAddTransaction?: () => void;
  onCreateBudget?: () => void;
  onSetGoal?: () => void;
  onCreateCategory?: () => void;
  onAddRecurringTransaction?: () => void;
}

export function Header({
  onMenuClick,
  title = "Dashboard",
  onAddTransaction,
  onCreateBudget,
  onSetGoal,
  onCreateCategory,
  onAddRecurringTransaction,
}: HeaderProps) {
  const { user: authUser, logout } = useAuth();
  const { data: userProfile } = useUserProfile();

  const user = userProfile?.user || authUser;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2 mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="gap-2">
                <Blocks className="" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAddTransaction}>
                <Plus className="mr-2 h-4 w-4" />
                Transaction
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateBudget}>
                <PiggyBank className="mr-2 h-4 w-4" />
                Budget
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSetGoal}>
                <Target className="mr-2 h-4 w-4" />
                Goal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateCategory}>
                <Tag className="mr-2 h-4 w-4" />
                Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddRecurringTransaction}>
                <Repeat className="mr-2 h-4 w-4" />
                Recurring Transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* <CurrencySelector /> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={logout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
