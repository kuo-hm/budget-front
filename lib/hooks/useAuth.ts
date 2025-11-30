"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { authApi, type LoginData, type RegisterData } from "@/lib/api/auth";
import { useState, useCallback } from "react";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    accessToken,
    isAuthenticated,
    setAuth,
    setTokens,
    logout: storeLogout,
    updateUser,
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (data: LoginData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authApi.login(data);
        setAuth(response.user, response.accessToken);
        router.push("/dashboard");
        return response;
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any;
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [router, setAuth]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authApi.register(data);
        setAuth(response.user, response.accessToken);
        router.push("/dashboard");
        return response;
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any;
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [router, setAuth]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      storeLogout();
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        router.push("/login");
      }
    }
  }, [router, storeLogout]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await authApi.refresh();
      setTokens(response.accessToken);
      return response.accessToken;
    } catch (err) {
      storeLogout();
      throw err;
    }
  }, [setTokens, storeLogout]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
    updateUser,
  };
}
