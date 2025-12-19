import { API_URL } from '@/lib/constants/api'
import { useAuthStore } from '@/lib/store/authStore'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor removed as we use cookies

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    console.log('Original request', originalRequest.url)
    console.log('Original request', error.response?.status)
    if (
      error.response?.status === 401
    ) {

      if (
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh') &&
        !originalRequest.url?.includes('/auth/logout')) {
        originalRequest._retry = true
        try {
          await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          )
          // Retry the original request
          return apiClient(originalRequest)
        } catch (refreshError) {

          return Promise.reject(refreshError)
        }
      } else {
        // Clear auth store first
        useAuthStore.getState().logout()

        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          { withCredentials: true },
        )
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register') &&
          window.location.pathname !== '/'
        ) {
          window.location.href = '/login'
        }

      }
    }


    return Promise.reject(error)
  },
)

export default apiClient
