"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  variant?: "default" | "primary" | "muted";
}

export function StatCard({ 
  icon: Icon, 
  value, 
  label,
  variant = "default"
}: StatCardProps) {
  // Define classes based on variant
  const getIconClass = () => {
    switch (variant) {
      case "primary": return "text-primary";
      case "muted": return "text-muted-foreground";
      default: return "text-primary";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 p-4">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Icon className={`h-8 w-8 ${getIconClass()}`} />
          <CardTitle className="text-lg font-semibold">{value}</CardTitle>
          <CardDescription>{label}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
