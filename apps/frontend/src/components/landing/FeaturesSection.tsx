import { 
  BookCheck, 
  Brain, 
  Bot, 
  BarChart4 
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl">
            Our platform offers comprehensive tools to help you master your medical exams
          </p>
        </div>
        
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:grid-cols-4 mt-8">
          {features.map((feature) => (
            <div key={feature.title} className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
