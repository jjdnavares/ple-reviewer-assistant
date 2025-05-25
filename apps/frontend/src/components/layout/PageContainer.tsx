"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
  noPadding?: boolean;
  withBackground?: boolean;
}

export function PageContainer({ 
  children, 
  className,
  maxWidth = "2xl",
  noPadding = false,
  withBackground = false
}: PageContainerProps) {
  // Map maxWidth to actual classes
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
    none: ""
  };

  return (
    <div 
      className={cn(
        "mx-auto w-full",
        !noPadding && "p-4 sm:p-6",
        maxWidthClasses[maxWidth],
        withBackground && "bg-card rounded-lg shadow-sm border",
        className
      )}
    >
      {children}
    </div>
  );
}
