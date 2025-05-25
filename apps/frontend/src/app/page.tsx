"use client";

import Link from "next/link";
import { BookCheck, Brain, Bot, BarChart4, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2, TypographyH3, TypographyP, TypographyLead } from "@/components/ui/typography";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PLE Reviewer</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              <li><Link href="/" className="text-sm font-medium text-primary">Home</Link></li>
              <li><Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</Link></li>
              <li><Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          </nav>
          <Button variant="ghost" size="sm" className="md:hidden">Menu</Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <TypographyH1>
                  Master Your Medical Licensure Exam
                </TypographyH1>
                <TypographyLead className="mx-auto max-w-[700px]">
                  Your comprehensive PLE review companion with AI-powered tools, practice exams, and performance tracking.
                </TypographyLead>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center space-y-4 text-center">
              <TypographyH2 className="border-none">
                Everything You Need to Succeed
              </TypographyH2>
              <TypographyLead className="max-w-[85%]">
                Our platform offers comprehensive tools to help you master your medical exams
              </TypographyLead>
            </div>
            
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:grid-cols-4 mt-8">
              {features.map((feature) => (
                <div key={feature.title} className="relative overflow-hidden rounded-lg border bg-card p-2 shadow-sm">
                  <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <TypographyH3 className="text-xl">{feature.title}</TypographyH3>
                      <TypographyP className="text-sm text-muted-foreground mt-0">{feature.description}</TypographyP>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <TypographyH2 className="border-none">
                  Ready to Ace Your Exams?
                </TypographyH2>
                <TypographyLead className="mx-auto max-w-[700px]">
                  Join thousands of medical students who have improved their scores with our platform.
                </TypographyLead>
              </div>
              <Button asChild size="lg">
                <Link href="/dashboard">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-bold">PLE Reviewer</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your comprehensive medical licensure exam review companion
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <ul className="flex flex-wrap items-center gap-4 md:gap-6 justify-center md:justify-end">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} PLE Reviewer Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Comprehensive Subject Review",
    description: "Access detailed content on all medical subjects covered in the exam",
    icon: BookCheck,
  },
  {
    title: "Practice Exams",
    description: "Test your knowledge with thousands of practice questions and full-length exams",
    icon: Brain,
  },
  {
    title: "AI Assistant",
    description: "Get personalized help and explanations from our advanced AI tutor",
    icon: Bot,
  },
  {
    title: "Performance Tracking",
    description: "Monitor your progress and identify areas for improvement",
    icon: BarChart4,
  },
];
