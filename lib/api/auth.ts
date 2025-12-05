import apiClient from "./client";
import authApiClient from "./auth-client";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    currency?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface VerifyEmailData {
  token?: string;
  code?: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token?: string;
  code?: string;
  newPassword: string;
}

export interface VerifyEmailChangeData {
  token: string;
  code: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authApiClient.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await authApiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ accessToken: string }>(
      "/auth/refresh"
    );
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailData): Promise<void> => {
    await authApiClient.post("/auth/verify-email", data);
  },

  verifyEmailChange: async (data: VerifyEmailChangeData): Promise<void> => {
    await authApiClient.post("/auth/verify-email-change", data);
  },

  resendVerification: async (data: ResendVerificationData): Promise<void> => {
    await authApiClient.post("/auth/resend-verification", data);
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    await authApiClient.post("/auth/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await apiClient.post("/auth/reset-password", data);
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  revoke: async (data: RefreshTokenData): Promise<void> => {
    await apiClient.post("/auth/revoke", data);
  },

  revokeAll: async (): Promise<void> => {
    await apiClient.post("/auth/revoke-all");
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTokens: async (): Promise<any> => {
    const response = await apiClient.get("/auth/tokens");
    return response.data;
  },
};
