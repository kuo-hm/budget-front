import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  currency?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const initializeFromStorage = () => {
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');
          const state = get();
          if (accessToken && state.user) {
            return {
              ...state,
              accessToken,
              refreshToken: refreshToken || state.refreshToken,
              isAuthenticated: true,
            };
          }
        }
        return null;
      };

      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        setAuth: (user, accessToken, refreshToken) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
          }
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        },
        setTokens: (accessToken, refreshToken) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
            }
          }
          set({
            accessToken,
            refreshToken: refreshToken || get().refreshToken,
            isAuthenticated: !!accessToken && !!get().user,
          });
        },
        logout: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        },
        updateUser: (userData) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          })),
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            state.accessToken = accessToken;
            state.isAuthenticated = !!state.user;
          }
        }
      },
    }
  )
);

