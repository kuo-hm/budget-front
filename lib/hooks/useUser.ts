import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateProfileData, userApi } from "../api/user";
import { toast } from "sonner";

export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ current, new: newPass }: { current: string; new: string }) =>
      userApi.changePassword(current, newPass),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });
}

export function useChangeEmail() {
  return useMutation({
    mutationFn: (newEmail: string) => userApi.changeEmail(newEmail),
    onSuccess: () => {
      toast.success("Verification email sent to new address");
    },
    onError: () => {
      toast.error("Failed to update email");
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: () => {
      toast.success("Account deleted");
      // Redirect or logout logic handled by component
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });
}
