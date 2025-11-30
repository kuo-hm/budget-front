"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useChangePassword,
  useRevokeSession,
  useSessions,
} from "@/lib/hooks/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Laptop, Smartphone, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function SecuritySettings() {
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();
  const {
    data: sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useSessions();
  const { mutate: revokeSession, isPending: isRevokingSession } =
    useRevokeSession();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: PasswordFormValues) {
    changePassword(
      { current: data.currentPassword, new: data.newPassword },
      {
        onSuccess: () => form.reset(),
      }
    );
  }

  const getDeviceIcon = (device: string) => {
    if (
      device.toLowerCase().includes("mobile") ||
      device.toLowerCase().includes("phone")
    ) {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Laptop className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage devices where you are currently logged in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSessions ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : sessionsError ? (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-center">
              Failed to load active sessions. Please try again later.
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      {getDeviceIcon(session.device)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {session.browser} on {session.device}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        <span>{session.location || "Unknown location"}</span>
                        <span>•</span>
                        <span>
                          {session.isCurrent
                            ? "Active now"
                            : `Last active ${formatDistanceToNow(
                                new Date(session.lastActive),
                                { addSuffix: true }
                              )}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  {session.isCurrent ? (
                    <span className="text-sm font-medium text-emerald-500">
                      Current Session
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                      disabled={isRevokingSession}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
              {sessions?.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No active sessions found.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
