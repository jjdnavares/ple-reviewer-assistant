"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Book, 
  FileText, 
  BarChart, 
  Bot, 
  ArrowRight 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DoctorBot } from "@/components/ai/DoctorBot";
import { PageContainer, SectionHeader, StatCard } from "@/components/layout";

// Temporary mock data
const recentExams = [
  { id: "1", title: "Pathology Practice Test", score: 78, total: 100, date: "2025-05-20" },
  { id: "2", title: "Pharmacology Quiz", score: 65, total: 80, date: "2025-05-18" },
];

const recommendedSubjects = [
  { id: "1", name: "Cardiology", progress: 45, questionCount: 230 },
  { id: "2", name: "Infectious Diseases", progress: 32, questionCount: 185 },
  { id: "3", name: "Endocrinology", progress: 18, questionCount: 145 },
];

export default function Dashboard() {
  const [showChat, setShowChat] = useState(false);

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setShowChat(!showChat)}>
          {showChat ? "Close Assistant" : "Open AI Assistant"}
        </Button>
      </div>

      {/* AI Assistant - Conditionally rendered */}
      {showChat && (
        <div className="mb-6">
          <DoctorBot />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <SectionHeader
              title="Quick Actions"
              description="Start your review session"
            />
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full justify-between" asChild>
              <Link href="/dashboard/exams/practice">
                Start Practice Exam <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button className="w-full justify-between" variant="outline" asChild>
              <Link href="/dashboard/subjects">
                Browse Subjects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button className="w-full justify-between" variant="outline" asChild>
              <Link href="/dashboard/ai-assistant">
                Chat with AI Assistant <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Exams */}
        <Card>
          <CardHeader>
            <SectionHeader
              title="Recent Exams"
              description="Your latest exam results"
            />
          </CardHeader>
          <CardContent>
            {recentExams.length > 0 ? (
              <div className="space-y-4">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {exam.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="font-medium">
                      {exam.score}/{exam.total}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No recent exams. Start practicing to see your results here.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="/dashboard/exams/history">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <SectionHeader
              title="Progress Overview"
              description="Your study progress by subject"
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedSubjects.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {subject.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {subject.questionCount} questions available
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="/dashboard/progress">
                View Progress <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Analytics and Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <SectionHeader
              title="Study Analytics"
              description="Your performance overview"
            />
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center border rounded-md">
              <BarChart className="h-16 w-16 text-muted-foreground/60" />
              <div className="ml-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Analytics will be available after completing more exams
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionHeader
              title="Recommended Study Topics"
              description="Focus on these areas to improve"
            />
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Cardiovascular Pharmacology</p>
                  <p className="text-sm text-muted-foreground">
                    Scored below average on related questions
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Respiratory Pathophysiology</p>
                  <p className="text-sm text-muted-foreground">
                    Needs more practice based on exam performance
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Diagnostic Criteria</p>
                  <p className="text-sm text-muted-foreground">
                    Review to maintain your strong performance
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="/dashboard/progress/recommendations">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
