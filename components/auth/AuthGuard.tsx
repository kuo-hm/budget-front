"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useAuth } from "@/lib/hooks/useAuth";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/auth/verify-email", "/forgot-password"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { refreshAccessToken } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Always try to refresh/verify session on mount
      try {
        await refreshAccessToken();
      } catch (error) {
        // If refresh fails, we are not authenticated
      } finally {
        setIsChecking(false);
      }
    };

    initAuth();
  }, [refreshAccessToken]);

  useEffect(() => {
    if (isChecking) return;
    
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    console.log(pathname)
    if (isAuthenticated) {
      if (isPublicRoute) {
        router.push("/dashboard");
      }
    } else {
      if (!isPublicRoute) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, pathname, router, isChecking]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
