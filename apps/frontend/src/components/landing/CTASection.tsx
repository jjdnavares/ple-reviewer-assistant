import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Ace Your Exams?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join thousands of medical students who have improved their scores with our platform.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
