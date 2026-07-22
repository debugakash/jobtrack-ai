import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/register-schema";
import { useRegister } from "../hooks/use-register";

export default function RegisterForm() {
  const { register, handleSubmit, formState } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...payload } = data;

    void confirmPassword;

    registerMutation.mutate(payload);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>

            <Input id="firstName" {...register("firstName")} />

            {formState.errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>

            <Input id="lastName" {...register("lastName")} />

            {formState.errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>

            <Input id="email" type="email" {...register("email")} />

            {formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>

            <Input id="password" type="password" {...register("password")} />

            {formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>

            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />

            {formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>

          {registerMutation.isError && (
            <p className="text-sm text-red-500">
              {(registerMutation.error as Error).message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
