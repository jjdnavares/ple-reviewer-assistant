"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    href?: string;
    label: string;
    onClick?: () => void;
  };
}

export function SectionHeader({ 
  title, 
  description, 
  action 
}: SectionHeaderProps) {
  // If we have an action with href, use Link, otherwise use Button with onClick
  const ActionButton = action ? (
    action.href ? (
      <Button variant="outline" size="sm" asChild className="gap-1">
        <Link href={action.href}>
          {action.label} <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    ) : (
      <Button variant="outline" size="sm" className="gap-1" onClick={action.onClick}>
        {action.label} <ChevronRight className="h-4 w-4" />
      </Button>
    )
  ) : null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {ActionButton && (
        <div className="flex items-center mt-2 sm:mt-0">
          {ActionButton}
        </div>
      )}
    </div>
  );
}
