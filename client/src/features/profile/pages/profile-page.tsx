import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CalendarDays,
  Camera,
  CircleCheck,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuthStore } from "@/stores/auth-store";
import { useUpdateProfile } from "../hooks/use-update-profile";

import { z } from "zod";
import { useUpdateAvatar } from "../hooks/use-update-avatar";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters long"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  const updateAvatarMutation = useUpdateAvatar();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  const updateProfileMutation = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }, [user, form]);

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    updateAvatarMutation.mutate(file, {
      onSettled: () => {
        event.target.value = "";
      },
    });
  }

  function onSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate(values);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24">
                {user?.avatar && (
                  <AvatarImage
                    src={`http://localhost:5000/${user.avatar}`}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                )}

                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={updateAvatarMutation.isPending}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Change profile picture"
              >
                {updateAvatarMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="mt-1 truncate text-sm text-muted-foreground">
                {user?.email}
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
                disabled={updateAvatarMutation.isPending}
              >
                {updateAvatarMutation.isPending
                  ? "Uploading..."
                  : user?.avatar
                    ? "Change Picture"
                    : "Add Picture"}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>

          <p className="text-sm text-muted-foreground">
            Update your name and account contact information.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormItem>
                <FormLabel>Email Address</FormLabel>

                <Input value={user?.email ?? ""} disabled />

                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed here.
                </p>
              </FormItem>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>

          <p className="text-sm text-muted-foreground">
            View your account details and verification status.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Member Since</p>

              <div className="mt-2 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />

                <p className="font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Email Verification
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CircleCheck
                  className={`h-4 w-4 ${
                    user?.emailVerified
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                />

                <p className="font-medium">
                  {user?.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Account Status</p>

              <div className="mt-2 flex items-center gap-2">
                <ShieldCheck
                  className={`h-4 w-4 ${
                    user?.isActive ? "text-green-600" : "text-destructive"
                  }`}
                />

                <p className="font-medium">
                  {user?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
