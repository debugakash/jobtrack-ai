import {
  Bell,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  Moon,
  Sun,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useTheme } from "next-themes";

import { useAuthStore } from "@/stores/auth-store";
import { useUpdateNotificationPreferences } from "../hooks/use-update-notification-preferences";
import { useChangePassword } from "../hooks/use-change-password";
import { useDeleteAccount } from "@/features/auth/hooks/use-delete-account";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/change-password-schema";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const user = useAuthStore((state) => state.user);

  const updateNotificationPreferences = useUpdateNotificationPreferences();

  const deleteAccountMutation = useDeleteAccount();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordMutation = useChangePassword();

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onChangePassword(values: ChangePasswordFormValues) {
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          passwordForm.reset();
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your preferences, notifications, and account security.
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Monitor className="h-4 w-4" />
            </div>

            <div>
              <CardTitle>Appearance</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Customize how JobTrack AI looks for you.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-lg border p-4 text-left transition-colors ${
                theme === "light"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <Sun className="h-5 w-5" />

              <p className="mt-3 font-medium">Light</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Use a light appearance.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-lg border p-4 text-left transition-colors ${
                theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <Moon className="h-5 w-5" />

              <p className="mt-3 font-medium">Dark</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Use a dark appearance.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`rounded-lg border p-4 text-left transition-colors ${
                theme === "system"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <Monitor className="h-5 w-5" />

              <p className="mt-3 font-medium">System</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Follow your device preference.
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Bell className="h-4 w-4" />
            </div>

            <div>
              <CardTitle>Notifications</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Email Notifications</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Receive important JobTrack AI updates by email.
                </p>
              </div>

              <Switch
                checked={user?.emailNotifications ?? false}
                disabled={updateNotificationPreferences.isPending}
                onCheckedChange={(checked) =>
                  updateNotificationPreferences.mutate({
                    emailNotifications: checked,
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Interview Reminders</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Get reminded about upcoming interviews.
                </p>
              </div>

              <Switch
                checked={user?.interviewReminders ?? false}
                disabled={updateNotificationPreferences.isPending}
                onCheckedChange={(checked) =>
                  updateNotificationPreferences.mutate({
                    interviewReminders: checked,
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Follow-up Reminders</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Get reminders when a job application needs a follow-up.
                </p>
              </div>

              <Switch
                checked={user?.followUpReminders ?? false}
                disabled={updateNotificationPreferences.isPending}
                onCheckedChange={(checked) =>
                  updateNotificationPreferences.mutate({
                    followUpReminders: checked,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Lock className="h-4 w-4" />
            </div>

            <div>
              <CardTitle>Security</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your password and account security.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onChangePassword)}
              className="space-y-5"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showCurrentPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className="pr-10"
                        />
                      </FormControl>

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showCurrentPassword
                            ? "Hide current password"
                            : "Show current password"
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="pr-10"
                        />
                      </FormControl>

                      <button
                        type="button"
                        onClick={() => setShowNewPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="pr-10"
                        />
                      </FormControl>

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending
                    ? "Changing..."
                    : "Change Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
              <TriangleAlert className="h-4 w-4 text-destructive" />
            </div>

            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Actions in this section can affect your account permanently.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Delete Account</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
                  disabled={deleteAccountMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />

                  {deleteAccountMutation.isPending
                    ? "Deleting..."
                    : "Delete Account"}
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. Your profile, jobs, resumes,
                    notifications, and other account data will be permanently
                    deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => deleteAccountMutation.mutate()}
                    disabled={deleteAccountMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteAccountMutation.isPending
                      ? "Deleting..."
                      : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
