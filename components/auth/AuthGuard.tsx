'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useAuthStore } from '@/lib/store/authStore'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/auth/verify-email',
  '/forgot-password',
  '/auth/check-email',
]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()
  const { refreshAccessToken } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      // Always try to refresh/verify session on mount
      try {
        await refreshAccessToken()
      } catch {
        // If refresh fails, we are not authenticated
      } finally {
        setIsChecking(false)
      }
    }

    initAuth()
  }, [refreshAccessToken])

  useEffect(() => {
    if (isChecking) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    if (isAuthenticated) {
      if (isPublicRoute) {
        router.push('/dashboard')
      }
    } else {
      if (!isPublicRoute) {
        router.push('/login')
      }
    }
  }, [isAuthenticated, pathname, router, isChecking])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  return <>{children}</>
}
