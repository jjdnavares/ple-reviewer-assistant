"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
  mainClassName?: string;
}

export function BaseLayout({ 
  children, 
  className,
  showFooter = true,
  mainClassName
}: BaseLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <Navbar />
      <main className={cn("flex-1", mainClassName)}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
