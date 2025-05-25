"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  TimerIcon,
  CheckCircle,
  Brain,
  Clock,
  BarChart4,
  FileQuestion,
  ChevronRight,
  Trophy,
  ListChecks
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageContainer, SectionHeader, StatCard } from "@/components/layout";

// Mock practice session types and exams for the subject
const mockPracticeData = {
  quickPractice: [
    {
      id: "qp1",
      title: "10 Random Questions",
      description: "Quick practice with 10 random questions from this subject",
      duration: "5-10 min",
      questions: 10,
      difficulty: "Mixed"
    },
    {
      id: "qp2",
      title: "Difficult Questions",
      description: "Focus on challenging questions you've missed before",
      duration: "10-15 min",
      questions: 15,
      difficulty: "Hard"
    },
    {
      id: "qp3",
      title: "New Questions",
      description: "Practice with questions you haven't seen before",
      duration: "10-15 min",
      questions: 15,
      difficulty: "Mixed"
    }
  ],
  fullExams: [
    {
      id: "fe1",
      title: "Comprehensive Subject Exam",
      description: "Full-length practice exam covering all topics in this subject",
      duration: "60 min",
      questions: 60,
      difficulty: "Hard",
      attempts: 125,
      avgScore: 76
    },
    {
      id: "fe2",
      title: "Topic-Focused Exam",
      description: "Practice exam focused on key topics within this subject",
      duration: "45 min",
      questions: 45,
      difficulty: "Medium",
      attempts: 98,
      avgScore: 82
    }
  ],
  recentPerformance: {
    correct: 65,
    total: 90,
    percentage: 72,
    streak: 5,
    lastPracticed: "2025-05-20T15:30:00Z",
    strongTopics: ["Cardiovascular System", "Respiratory System"],
    weakTopics: ["Nervous System", "Digestive System"]
  }
};

export default function SubjectPracticePage() {
  const params = useParams();
  const router = useRouter();
  const { id: subjectId } = params;
  const [practiceData, setPracticeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [practiceType, setPracticeType] = useState("quick");

  // Fetch practice data
  useEffect(() => {
    const fetchPracticeData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setPracticeData(mockPracticeData);
      } catch (error) {
        console.error("Error fetching practice data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeData();
  }, [subjectId]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading practice options...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!practiceData) {
    return (
      <PageContainer>
        <div className="flex h-[400px] flex-col items-center justify-center">
          <FileQuestion className="h-16 w-16 text-muted-foreground/60" />
          <h2 className="mt-4 text-xl font-semibold">Practice data not available</h2>
          <p className="mt-2 text-muted-foreground">
            Unable to load practice options for this subject.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      {/* Performance Summary */}
      {practiceData.recentPerformance && (
        <Card>
          <CardHeader>
            <SectionHeader
              title="Recent Performance"
              description="Your performance data for this subject"
            />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Accuracy
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-bold ${
                    practiceData.recentPerformance.percentage >= 70 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {practiceData.recentPerformance.percentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ({practiceData.recentPerformance.correct}/{practiceData.recentPerformance.total})
                  </div>
                </div>
                <Progress 
                  value={practiceData.recentPerformance.percentage} 
                  className="h-2 mt-2" 
                />
              </div>
              
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <div className="text-2xl font-bold">
                    {practiceData.recentPerformance.streak}
                  </div>
                  <div className="text-sm text-muted-foreground">days</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Last Practiced
                </div>
                <div className="text-base font-medium">
                  {formatDate(practiceData.recentPerformance.lastPracticed)}
                </div>
              </div>
              
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Strengths / Weaknesses
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {practiceData.recentPerformance.strongTopics.map((topic: string, index: number) => (
                    <Badge key={`strong-${index}`} variant="success" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {practiceData.recentPerformance.weakTopics.map((topic: string, index: number) => (
                    <Badge key={`weak-${index}`} variant="outline" className="text-xs text-red-500 border-red-200">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice Options */}
      <div>
        <div className="mb-4">
          <SectionHeader 
            title="Practice Options" 
            description="Choose a practice mode that fits your study needs"
          />
        </div>
        <Tabs defaultValue="quick" value={practiceType} onValueChange={setPracticeType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Practice</TabsTrigger>
            <TabsTrigger value="full">Full Exams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {practiceData.quickPractice.map((item: any) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                        <span>{item.questions} Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/subjects/${subjectId}/practice?type=quick&id=${item.id}`}>
                        Start Practice
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="full" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {practiceData.fullExams.map((exam: any) => (
                <Card key={exam.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{exam.title}</CardTitle>
                      <Badge variant={exam.difficulty === "Hard" ? "destructive" : "default"}>
                        {exam.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.questions} Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Avg. Score: {exam.avgScore}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart4 className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.attempts} Attempts</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/subjects/${subjectId}/practice`}>
                        Start Exam
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Study Recommendations */}
      <Card>
        <CardHeader>
          <SectionHeader
            title="Personalized Study Plan"
            description="Recommendations based on your performance and upcoming exams"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="flex items-center gap-2 font-medium">
                <Brain className="h-5 w-5 text-primary" />
                Focus on Weak Areas
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on your recent performance, we recommend focusing on the Nervous System and Digestive System topics.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <Link href={`/dashboard/subjects/${subjectId}/content?topic=nervous-system`}>
                    Study Nervous System <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="flex items-center gap-2 font-medium">
                <ListChecks className="h-5 w-5 text-primary" />
                Complete Practice Set
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You're 75% through your weekly practice goal. Complete 25 more questions to stay on track.
              </p>
              <div className="mt-2">
                <Progress value={75} className="h-2" />
                <div className="mt-2 text-xs text-right text-muted-foreground">75/100 questions completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
