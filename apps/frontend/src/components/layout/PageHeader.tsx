"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  backButton?: {
    href: string;
    label: string;
  };
  actions?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  backButton, 
  actions 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6">
      <div>
        {backButton && (
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href={backButton.href}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backButton.label}
            </Link>
          </Button>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
