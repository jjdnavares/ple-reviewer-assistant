import { User } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl">
            Hear from medical students who have used our platform to prepare for their licensure exams
          </p>
        </div>
        
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:max-w-[64rem] mt-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg border bg-background p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm">{testimonial.quote}</p>
                  <div className="pt-2">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote: "The AI-powered explanations helped me understand complex concepts that I had been struggling with for weeks. This platform was instrumental in my exam success.",
    name: "Dr. Maria Santos",
    title: "Recent PLE Passer"
  },
  {
    quote: "The practice exams were incredibly similar to the actual PLE. The performance tracking helped me focus on my weak areas and significantly improved my scores.",
    name: "Dr. James Chen",
    title: "Medical Resident"
  },
  {
    quote: "I was able to study more efficiently and cover more content thanks to the structured approach of this platform. Highly recommended for all medical students.",
    name: "Dr. Sarah Johnson",
    title: "General Practitioner"
  }
];
