"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookCheck, 
  FileText, 
  BarChart3, 
  Bot, 
  Settings
} from "lucide-react";
import { BaseLayout } from "./BaseLayout";
import { PageHeader } from "./PageHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Override the default sidebar links for dashboard section
export const dashboardLinks = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/dashboard/subjects",
    label: "Subjects",
    icon: <BookCheck className="h-5 w-5" />,
  },
  {
    href: "/dashboard/exams",
    label: "Practice Exams",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    href: "/dashboard/progress",
    label: "Progress",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    href: "/dashboard/ai-assistant",
    label: "AI Assistant",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  // Determine the current page title based on the path
  const getCurrentPageTitle = () => {
    const currentLink = dashboardLinks.find(
      link => pathname === link.href || 
      (link.href !== "/dashboard" && pathname.startsWith(link.href))
    );
    return currentLink?.label || "Dashboard";
  };

  return (
    <BaseLayout showFooter={true} mainClassName="p-0">
      <div className="px-4 py-6 md:px-6">
        <PageHeader title={getCurrentPageTitle()} />
        <div className="mt-6">
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}
