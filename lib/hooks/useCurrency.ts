import { useUserProfile } from "./useUser";
import { useMemo } from "react";

export function useCurrency() {
  const { data: profile, isLoading } = useUserProfile();
  const currency = profile?.user.baseCurrency || "USD";

  const formatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    });
  }, [currency]);

  const format = (amount: number) => {
    return formatter.format(amount);
  };

  return {
    currency,
    format,
    isLoading,
  };
}
