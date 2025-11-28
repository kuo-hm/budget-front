'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';

export function AuthInitializer() {
    const { refreshAccessToken } = useAuth();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            if (!isAuthenticated) {
                try {
                    await refreshAccessToken();
                } catch (error) {
                    // User is not logged in or refresh token is invalid
                    // We don't need to do anything here, just stay logged out
                }
            }
        };

        initAuth();
    }, [isAuthenticated, refreshAccessToken]);

    return null;
}
