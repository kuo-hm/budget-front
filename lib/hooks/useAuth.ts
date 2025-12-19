'use client'

import { authApi, type LoginData, type RegisterData } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

export function useAuth() {
  const router = useRouter()
  const {
    user,
    accessToken,
    isAuthenticated,
    setAuth,
    setTokens,
    logout: storeLogout,
    updateUser,
  } = useAuthStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(
    async (data: LoginData) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await authApi.login(data)

        setAuth(response.user, response.accessToken)
        console.log(response)
        router.push('/dashboard')
        return response
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any
        const errorMessage =
          error.response?.data?.message || 'Login failed. Please try again.'
        setError(errorMessage)
        if (
          error.response?.data?.message ===
          'Please verify your email address before logging in'
        ) {
          router.push(
            `/auth/check-email?email=${encodeURIComponent(data.email)}`,
          )
        }
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [router, setAuth],
  )

  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true)
      setError(null)
      try {
        await authApi.register(data)
        router.push(`/auth/check-email?email=${encodeURIComponent(data.email)}`)
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any
        const errorMessage =
          error.response?.data?.message ||
          'Registration failed. Please try again.'
        setError(errorMessage)
        console.error('Registration error:', error)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      storeLogout()
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        router.push('/login')
      }
    }
  }, [router, storeLogout])

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await authApi.refresh()
      setTokens(response.accessToken)
      return response.accessToken
    } catch (err) {
      storeLogout()
      throw err
    }
  }, [setTokens, storeLogout])

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
  }
}
