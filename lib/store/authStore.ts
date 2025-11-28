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
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setTokens: (accessToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const initializeFromStorage = () => {
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken');
          const state = get();
          if (accessToken && state.user) {
            return {
              ...state,
              accessToken,
              isAuthenticated: true,
            };
          }
        }
        return null;
      };

      return {
        user: null,
        accessToken: null,
        isAuthenticated: false,
        setAuth: (user, accessToken) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
          }
          set({
            user,
            accessToken,
            isAuthenticated: true,
          });
        },
        setTokens: (accessToken) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
          }
          set({
            accessToken,
            isAuthenticated: !!accessToken && !!get().user,
          });
        },
        logout: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          set({
            user: null,
            accessToken: null,
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

