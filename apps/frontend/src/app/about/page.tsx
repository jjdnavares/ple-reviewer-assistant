"use client";

import Link from "next/link";
import { BookOpen, Users, Award, Lightbulb, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2, TypographyH3, TypographyP, TypographyLead, TypographyLarge } from "@/components/ui/typography";

export const metadata = {
  title: "About Us | PLE Reviewer Assistant",
  description: "Learn about our mission to help medical students excel in their licensure exams",
};

export default function AboutPage() {
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
              <li><Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/about" className="text-sm font-medium text-primary">About</Link></li>
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
        {/* Header */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <TypographyH1>
                  About PLE Reviewer Assistant
                </TypographyH1>
                <TypographyLead className="mx-auto max-w-[700px]">
                  Our mission is to empower medical students with the tools they need to excel in their licensure exams
                </TypographyLead>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <TypographyH2 className="mb-4 border-none">
                  Our Story
                </TypographyH2>
                <div className="space-y-4">
                  <TypographyP className="text-muted-foreground">
                    PLE Reviewer Assistant was founded in 2023 by a team of medical professionals and
                    educators who recognized the challenges faced by medical students preparing for
                    their licensure exams.
                  </TypographyP>
                  <TypographyP className="text-muted-foreground">
                    Having experienced the difficulties of exam preparation firsthand, our founders
                    set out to create a comprehensive platform that combines traditional study methods
                    with cutting-edge AI technology to provide a more effective and personalized
                    learning experience.
                  </TypographyP>
                  <TypographyP className="text-muted-foreground">
                    What started as a simple question bank has evolved into a full-fledged learning
                    platform with AI-powered explanations, performance tracking, and a vast library
                    of educational resources designed specifically for medical students.
                  </TypographyP>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-muted/50 shadow-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm">
                      <span className="text-3xl font-bold text-primary">2,000+</span>
                      <span className="text-sm text-muted-foreground">Active Users</span>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm">
                      <span className="text-3xl font-bold text-primary">5,000+</span>
                      <span className="text-sm text-muted-foreground">Practice Questions</span>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm">
                      <span className="text-3xl font-bold text-primary">92%</span>
                      <span className="text-sm text-muted-foreground">Pass Rate</span>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm">
                      <span className="text-3xl font-bold text-primary">24/7</span>
                      <span className="text-sm text-muted-foreground">AI Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center space-y-4 text-center">
              <TypographyH2 className="border-none">
                Our Mission
              </TypographyH2>
              <TypographyLead className="max-w-[85%]">
                We're dedicated to transforming how medical students prepare for their licensure exams
              </TypographyLead>
            </div>
            
            <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:grid-cols-4 lg:max-w-[64rem] mt-8">
              {missionPoints.map((point, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <point.icon className="h-8 w-8 text-primary" />
                  </div>
                  <TypographyH3 className="text-xl">
                    {point.title}
                  </TypographyH3>
                  <TypographyP className="text-sm text-muted-foreground mt-0">
                    {point.description}
                  </TypographyP>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center space-y-4 text-center">
              <TypographyH2 className="border-none">
                Meet Our Team
              </TypographyH2>
              <TypographyLead className="max-w-[85%]">
                We're a passionate team of medical professionals, educators, and technology experts
              </TypographyLead>
            </div>
            
            <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:grid-cols-3 lg:max-w-[64rem] mt-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 text-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-background bg-primary/5 shadow-md">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="h-20 w-20 text-primary/40" />
                    </div>
                  </div>
                  <div>
                    <TypographyH3 className="text-xl">{member.name}</TypographyH3>
                    <TypographyP className="text-sm text-muted-foreground mt-0">{member.title}</TypographyP>
                  </div>
                  <TypographyP className="text-sm">{member.bio}</TypographyP>
                </div>
              ))}
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

const missionPoints = [
  {
    title: "Accessible Education",
    description: "Making high-quality medical education accessible to all students regardless of background",
    icon: Users,
  },
  {
    title: "Excellence in Learning",
    description: "Promoting excellence through evidence-based educational methods and content",
    icon: Award,
  },
  {
    title: "Innovation",
    description: "Continuously innovating our platform with the latest in AI and educational technology",
    icon: Lightbulb,
  },
  {
    title: "Student Success",
    description: "Putting student success at the center of everything we do and every feature we build",
    icon: User,
  },
];

const teamMembers = [
  {
    name: "Dr. Maria Garcia",
    title: "Founder & Medical Director",
    bio: "Board-certified physician with over 15 years of experience in medical education and exam preparation.",
  },
  {
    name: "Dr. James Wilson",
    title: "Content Director",
    bio: "Specialist in creating high-quality medical exam content and developing effective learning strategies.",
  },
  {
    name: "Sarah Chen",
    title: "AI Technology Lead",
    bio: "Expert in artificial intelligence with a focus on educational applications and personalized learning.",
  },
];
