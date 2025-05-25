import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-b">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              AI-Powered Learning
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Master Your Medical Licensure Exam
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Your comprehensive PLE review companion with AI-powered tools, practice exams, and performance tracking.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-6 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-background bg-muted">
                  <span className="sr-only">User {i}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span><strong>2,000+</strong> students improved their scores</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
