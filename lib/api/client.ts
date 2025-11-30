import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor removed as we use cookies

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/logout")
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"
          }/auth/refresh`,
          {},
          { withCredentials: true }
        );
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register") &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
