import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import {
  CalendarDays,
  Camera,
  CircleCheck,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuthStore } from "@/stores/auth-store";

import { useUpdateProfile } from "../hooks/use-update-profile";
import { useUpdateAvatar } from "../hooks/use-update-avatar";

import {
  profileSchema,
  type ProfileFormValues,
} from "../validators/profile-schema";

import { toast } from "sonner";
import ResumePreferences from "../components/resume-preferences";
import ProfileCompleteness from "../components/profile-completeness";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = useUpdateAvatar();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
      location: user?.location ?? "",
      headline: user?.headline ?? "",
      bio: user?.bio ?? "",
      linkedinUrl: user?.linkedinUrl ?? "",
      githubUrl: user?.githubUrl ?? "",
      portfolioUrl: user?.portfolioUrl ?? "",
      skills: user?.skills ?? "",
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? "",
      location: user.location ?? "",
      headline: user.headline ?? "",
      bio: user.bio ?? "",
      linkedinUrl: user.linkedinUrl ?? "",
      githubUrl: user.githubUrl ?? "",
      portfolioUrl: user.portfolioUrl ?? "",
      skills: user.skills ?? "",
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
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24">
                {user?.avatarUrl && (
                  <AvatarImage
                    src={user.avatarUrl}
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

              <p className="mt-1 text-sm text-muted-foreground">
                {user?.headline || "Add a professional headline"}
              </p>

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

      <ProfileCompleteness />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>

              <p className="text-sm text-muted-foreground">
                Keep your personal and contact information up to date.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>

                      <FormControl>
                        <Input placeholder="Akash" {...field} />
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
                        <Input placeholder="Arya" {...field} />
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

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>

                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>

                      <FormControl>
                        <Input placeholder="Indore, India" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>

              <p className="text-sm text-muted-foreground">
                Add information that represents your professional background and
                helps personalize future AI features.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Headline</FormLabel>

                    <FormControl>
                      <Input placeholder="Full Stack Developer" {...field} />
                    </FormControl>

                    <p className="text-xs text-muted-foreground">
                      A short description of your professional identity.
                    </p>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>

                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Tell recruiters a little about your experience, strengths, and career interests..."
                        {...field}
                      />
                    </FormControl>

                    <p className="text-xs text-muted-foreground">
                      Keep this focused on your professional background.
                    </p>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                          <Input
                            className="pl-9"
                            placeholder="https://linkedin.com/in/..."
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                          <Input
                            className="pl-9"
                            placeholder="https://github.com/..."
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio</FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          className="pl-9"
                          placeholder="https://yourportfolio.com"
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>

                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="React, TypeScript, JavaScript, Node.js, Express.js, PostgreSQL"
                        {...field}
                      />
                    </FormControl>

                    <p className="text-xs text-muted-foreground">
                      Separate skills with commas. This information can later be
                      used by AI Resume Matching.
                    </p>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>

              <p className="text-sm text-muted-foreground">
                A quick overview of the information currently visible on your
                profile.
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Location</p>

                    <p className="truncate font-medium">
                      {user?.location || "Not added"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>

                    <p className="truncate font-medium">
                      {user?.phone || "Not added"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ResumePreferences />

          {/* Account Information */}
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
                  <p className="text-sm text-muted-foreground">
                    Account Status
                  </p>

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

          {/* Save */}
          <div className="flex justify-end pb-6">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
