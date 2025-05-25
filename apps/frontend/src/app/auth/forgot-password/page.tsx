"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setIsSubmitted(true);
      toast({
        title: "Request submitted",
        description: "If your email is registered, you will receive password reset instructions.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            If an account exists for {<span className="font-medium">the email you entered</span>}, you will receive password reset instructions shortly.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Return to login</Link>
          </Button>
        </div>
      )}
      
      <div className="mt-4 text-center text-sm">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
}
