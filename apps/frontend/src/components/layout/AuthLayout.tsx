"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showLogo?: boolean;
  className?: string;
  cardClassName?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  showLogo = true,
  className,
  cardClassName,
}: AuthLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
      
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-md">
          {showLogo && (
            <div className="mb-8 flex justify-center">
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-10 w-10 text-primary" />
                <span className="text-2xl font-bold">PLE Reviewer</span>
              </Link>
            </div>
          )}
          
          <div className={cn("rounded-lg border bg-card p-8 shadow-sm", cardClassName)}>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">{title}</h1>
              {description && (
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            
            {children}
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary underline underline-offset-4">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
