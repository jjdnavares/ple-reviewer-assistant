"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Home, 
  Info, 
  LayoutDashboard, 
  Mail, 
  Menu, 
  X, 
  LogIn, 
  UserPlus,
  User,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { dashboardLinks } from "./DashboardLayout";

const mainNavLinks = [
  { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/about", label: "About", icon: <Info className="h-5 w-5" /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/contact", label: "Contact", icon: <Mail className="h-5 w-5" /> },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [displayedLinks, setDisplayedLinks] = useState(mainNavLinks);
  const pathname = usePathname();

  // Determine which links to show based on the current path
  useEffect(() => {
    if (pathname.startsWith('/dashboard')) {
      setDisplayedLinks(dashboardLinks);
    } else {
      setDisplayedLinks(mainNavLinks);
    }
  }, [pathname]);

  // Check if we're in the dashboard area
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      {/* Mobile menu backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "transition-all duration-300",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href={isDashboard ? "/dashboard" : "/"} className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {!isCollapsed && <span className="text-xl font-bold">PLE Reviewer</span>}
          </Link>
          <div className="flex items-center gap-2">
            {!isCollapsed && <ThemeToggle />}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {displayedLinks.map((link) => {
              const isActive = isDashboard
                ? pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))
                : pathname === link.href;
              
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.icon}
                    {!isCollapsed && (
                      <>
                        <span>{link.label}</span>
                        {isActive && isDashboard && <ChevronRight className="ml-auto h-4 w-4" />}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {isDashboard ? (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              {!isCollapsed ? (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">Medical Student</p>
                    <p className="truncate text-xs text-muted-foreground">
                      student@example.com
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border-t p-4">
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <Button asChild variant="outline" size="icon">
                  <Link href="/auth/login">
                    <LogIn className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="icon">
                  <Link href="/auth/register">
                    <UserPlus className="h-5 w-5" />
                  </Link>
                </Button>
                {isCollapsed && <ThemeToggle />}
              </div>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
