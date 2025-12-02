"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { currencies } from "@/lib/constants/currencies";
import { useUpdateProfile, useUserProfile } from "@/lib/hooks/useUser";

export function CurrencySelector() {
    const [open, setOpen] = React.useState(false);
    const { data: profile } = useUserProfile();
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const currentCurrency = profile?.user.baseCurrency || "USD";

    const handleSelect = (currencyCode: string) => {
        updateProfile({ baseCurrency: currencyCode.split('#')[0] });
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[80px] justify-between px-2"
                    disabled={isPending}
                >
                    {currentCurrency}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search currency..." />
                    <CommandList>
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                            {currencies.map((currency) => (
                                <CommandItem
                                    key={currency.code}
                                    value={currency.code + '#' + currency.name}
                                    onSelect={() => handleSelect(currency.code)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentCurrency === currency.code
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {currency.code} - {currency.name} ({currency.symbol})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
