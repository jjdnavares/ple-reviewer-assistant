"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";
import Link from "next/link";

interface ContentLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: "left" | "right";
  className?: string;
  contentClassName?: string;
}

export function ContentLayout({
  children,
  title,
  description,
  backHref,
  backLabel = "Back",
  actions,
  sidebar,
  sidebarPosition = "left",
  className,
  contentClassName,
}: ContentLayoutProps) {
  return (
    <PageContainer className={className}>
      <div className="mb-6 space-y-2">
        {backHref && (
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-muted-foreground"
            asChild
          >
            <Link href={backHref}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        )}
        <PageHeader title={title} description={description} actions={actions} />
      </div>

      {sidebar ? (
        <div
          className={cn(
            "grid gap-8",
            sidebarPosition === "left"
              ? "md:grid-cols-[280px_1fr]"
              : "md:grid-cols-[1fr_280px]"
          )}
        >
          {sidebarPosition === "left" && (
            <aside className="border-r pr-6 hidden md:block">
              {sidebar}
            </aside>
          )}
          
          <main className={contentClassName}>{children}</main>
          
          {sidebarPosition === "right" && (
            <aside className="border-l pl-6 hidden md:block">
              {sidebar}
            </aside>
          )}
          
          {/* Mobile sidebar - always shown below content */}
          <div className="border-t pt-6 mt-6 md:hidden">
            {sidebar}
          </div>
        </div>
      ) : (
        <main className={contentClassName}>{children}</main>
      )}
    </PageContainer>
  );
}
