import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authManager, type RegisterData } from "@/lib/auth";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      avatarUrl: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => {
      // Remove empty avatarUrl
      const cleanData = { ...data };
      if (!cleanData.avatarUrl) {
        delete cleanData.avatarUrl;
      }
      return authManager.register(cleanData);
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Welcome to ClimbTracker!",
      });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join ClimbTracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
            <Input
              id="avatarUrl"
              placeholder="https://example.com/avatar.jpg"
              {...form.register("avatarUrl")}
            />
            {form.formState.errors.avatarUrl && (
              <p className="text-sm text-red-500">
                {form.formState.errors.avatarUrl.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}