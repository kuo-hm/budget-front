import apiClient from "./client";

export interface UserProfile {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: string;
    providerId: string;
    emailVerified: boolean;
    emailVerificationToken: string | null;
    emailVerificationTokenExpires: string | null;
    emailVerificationCode: string | null;
    emailVerificationCodeExpires: string | null;
    passwordResetToken: string | null;
    passwordResetTokenExpires: string | null;
    passwordResetCode: string | null;
    passwordResetCodeExpires: string | null;
    baseCurrency: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
  preferences?: {
    currency?: string;
    theme?: "light" | "dark" | "system";
  };
}

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/user/me");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await apiClient.patch<UserProfile>("/user/me", data);
    return response.data;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.patch("/user/me/password", {
      currentPassword,
      newPassword,
    });
  },

  changeEmail: async (newEmail: string): Promise<void> => {
    await apiClient.patch("/user/me/email", { newEmail });
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete("/user/me");
  },
};
