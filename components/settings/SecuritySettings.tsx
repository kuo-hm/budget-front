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
  useChangeEmail,
  useActiveSessions,
  useRevokeSession,
  useRevokeAllSessions,
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

  const { mutate: changeEmail, isPending: isChangingEmail } = useChangeEmail();

  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      })
    ),
    defaultValues: {
      email: "",
    },
  });

  function onEmailSubmit(data: { email: string }) {
    changeEmail(data.email, {
      onSuccess: () => emailForm.reset(),
    });
  }

  const { data: sessions, isLoading: isLoadingSessions } = useActiveSessions();
  const { mutate: revokeSession, isPending: isRevoking } = useRevokeSession();
  const { mutate: revokeAll, isPending: isRevokingAll } =
    useRevokeAllSessions();

  return (
    <div className="space-y-8">
      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions on other devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSessions ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {/* Placeholder logic for icon based on UA if available, else Laptop */}
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {session.userAgent || "Unknown Device"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last active:{" "}
                        {session.updatedAt
                          ? formatDistanceToNow(new Date(session.updatedAt), {
                              addSuffix: true,
                            })
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeSession(session.refreshToken)}
                      disabled={isRevoking}
                    >
                      Revoke
                    </Button>
                  )}
                  {session.isCurrent && (
                    <span className="text-sm font-medium text-green-500">
                      Current Session
                    </span>
                  )}
                </div>
              ))}
              {sessions && sessions.length > 1 && (
                <div className="flex justify-end pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => revokeAll()}
                    disabled={isRevokingAll}
                  >
                    {isRevokingAll && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Revoke All Other Sessions
                  </Button>
                </div>
              )}
               {(!sessions || sessions.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No active sessions found.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Email */}
      <Card>
        <CardHeader>
          <CardTitle>Change Email</CardTitle>
          <CardDescription>
            Update your email address. We will send a verification link to the
            new address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="new.email@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isChangingEmail}>
                {isChangingEmail && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Email
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password */}
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
    </div>
  );
}
