import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  currency?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string) => void
  setTokens: (accessToken: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
    })
  },
  setTokens: (accessToken) => {
    set({
      accessToken,
      isAuthenticated: true,
    })
  },
  logout: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    })
  },
  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),
}))
