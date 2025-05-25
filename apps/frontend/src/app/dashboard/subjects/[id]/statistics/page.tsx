"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  BarChart, 
  LineChart, 
  PieChart,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageContainer, SectionHeader, StatCard } from "@/components/layout";

// Mock data for statistics
const mockStatistics = {
  overall: {
    totalQuestions: 450,
    correctAnswers: 315,
    incorrectAnswers: 135,
    accuracy: 70,
    totalTime: 1250, // minutes
    averageTime: 2.8, // minutes per question
    completionRate: 65, // percentage of subject covered
  },
  performance: {
    weekly: [
      { week: "Week 1", questions: 75, correct: 45, accuracy: 60 },
      { week: "Week 2", questions: 90, correct: 63, accuracy: 70 },
      { week: "Week 3", questions: 110, correct: 77, accuracy: 70 },
      { week: "Week 4", questions: 85, correct: 64, accuracy: 75 },
    ],
    byTopic: [
      { topic: "Musculoskeletal System", accuracy: 75, questions: 85 },
      { topic: "Cardiovascular System", accuracy: 60, questions: 90 },
      { topic: "Respiratory System", accuracy: 70, questions: 75 },
      { topic: "Nervous System", accuracy: 55, questions: 110 },
      { topic: "Digestive System", accuracy: 65, questions: 90 },
    ],
  },
  recentActivity: [
    {
      id: "act1",
      type: "practice",
      title: "Quick Practice: Cardiovascular System",
      date: "2025-05-22T14:30:00Z",
      score: 8,
      total: 10,
      percentage: 80,
    },
    {
      id: "act2",
      type: "exam",
      title: "Full Subject Exam: Anatomy",
      date: "2025-05-20T09:15:00Z",
      score: 45,
      total: 60,
      percentage: 75,
    },
    {
      id: "act3",
      type: "practice",
      title: "Topic Practice: Nervous System",
      date: "2025-05-18T16:45:00Z",
      score: 12,
      total: 20,
      percentage: 60,
    },
  ],
  weakAreas: [
    {
      topic: "Autonomic Nervous System",
      accuracy: 45,
      questions: 35,
      subtopic: "Nervous System",
    },
    {
      topic: "Vascular System",
      accuracy: 55,
      questions: 30,
      subtopic: "Cardiovascular System",
    },
    {
      topic: "Lower GI Tract",
      accuracy: 60,
      questions: 30,
      subtopic: "Digestive System",
    },
  ],
  strongAreas: [
    {
      topic: "Upper Limb",
      accuracy: 80,
      questions: 25,
      subtopic: "Musculoskeletal System",
    },
    {
      topic: "Upper Respiratory Tract",
      accuracy: 75,
      questions: 25,
      subtopic: "Respiratory System",
    },
    {
      topic: "Heart Anatomy",
      accuracy: 70,
      questions: 35,
      subtopic: "Cardiovascular System",
    },
  ],
};

export default function SubjectStatisticsPage() {
  const params = useParams();
  const { id: subjectId } = params;
  
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframeTab, setTimeframeTab] = useState("weekly");

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setStatistics(mockStatistics);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [subjectId]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading statistics...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!statistics) {
    return (
      <PageContainer>
        <div className="flex h-[400px] flex-col items-center justify-center">
          <BarChart className="h-16 w-16 text-muted-foreground/60" />
          <h2 className="mt-4 text-xl font-semibold">Statistics not available</h2>
          <p className="mt-2 text-muted-foreground">
            We don't have enough data yet to show your statistics.
          </p>
          <Button className="mt-4" asChild>
            <Link href={`/dashboard/subjects/${subjectId}/practice`}>
              Start practicing to generate statistics
            </Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      {/* Summary Stats */}
      <div className="mb-4">
        <SectionHeader 
          title="Performance Summary" 
          description="Overview of your study performance"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.overall.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.overall.completionRate}% of subject covered
            </p>
            <Progress value={statistics.overall.completionRate} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.overall.accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              {statistics.overall.correctAnswers} correct out of {statistics.overall.totalQuestions}
            </p>
            <Progress 
              value={statistics.overall.accuracy} 
              className={`h-1 mt-2 ${
                statistics.overall.accuracy >= 70 ? 'bg-green-600' : 
                statistics.overall.accuracy >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }`} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.overall.totalTime} min</div>
            <p className="text-xs text-muted-foreground">
              Avg. {statistics.overall.averageTime} min per question
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weak Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.weakAreas.length}</div>
            <p className="text-xs text-muted-foreground">
              Topics that need improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Over Time */}
      <Card>
        <CardHeader>
          <SectionHeader
            title="Performance Over Time"
            description="Your accuracy and question count over time"
          />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly" value={timeframeTab} onValueChange={setTimeframeTab}>
            <TabsList className="grid w-full max-w-xs grid-cols-3">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="mt-4">
              <div className="h-[300px] w-full py-4">
                <div className="flex h-full flex-col justify-between">
                  {/* Simplified chart representation */}
                  <div className="flex h-60 items-end gap-2">
                    {statistics.performance.weekly.map((week: any, index: number) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-1">
                        <div className="w-full text-center text-xs font-medium">
                          {week.accuracy}%
                        </div>
                        <div className="relative w-full max-w-[40px]">
                          <div
                            className="w-full rounded-t bg-primary"
                            style={{ height: `${week.accuracy * 2}px` }}
                          ></div>
                          <div
                            className="absolute bottom-0 w-full rounded-t bg-primary/30"
                            style={{ height: `${120}px`, zIndex: -1 }}
                          ></div>
                        </div>
                        <div className="mt-1 text-center text-xs text-muted-foreground">
                          {week.week}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between px-2 pt-4 text-sm text-muted-foreground">
                    <div>
                      <LineChart className="mr-1 inline-block h-4 w-4" />
                      Accuracy
                    </div>
                    <div>
                      <BarChart className="mr-1 inline-block h-4 w-4" />
                      Question Volume
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="monthly" className="h-[300px] w-full py-4">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Monthly data visualization would appear here
              </div>
            </TabsContent>
            <TabsContent value="yearly" className="h-[300px] w-full py-4">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Yearly data visualization would appear here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Topics Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strong Areas */}
        <Card>
          <CardHeader>
            <SectionHeader
              title="Strong Areas"
              description="Topics where you're performing well"
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.strongAreas.map((area: any, index: number) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{area.topic}</div>
                      <div className="text-xs text-muted-foreground">
                        {area.subtopic}
                      </div>
                    </div>
                    <Badge variant="success">
                      {area.accuracy}%
                    </Badge>
                  </div>
                  <Progress value={area.accuracy} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weak Areas */}
        <Card>
          <CardHeader>
            <SectionHeader
              title="Areas for Improvement"
              description="Topics where you should focus more"
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.weakAreas.map((area: any, index: number) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{area.topic}</div>
                      <div className="text-xs text-muted-foreground">
                        {area.subtopic}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-red-500 border-red-200">
                      {area.accuracy}%
                    </Badge>
                  </div>
                  <Progress value={area.accuracy} className="h-1.5" />
                  <Button variant="outline" size="sm" className="mt-1 w-full gap-1 text-xs" asChild>
                    <Link href={`/dashboard/subjects/${subjectId}/practice?topic=${area.topic.toLowerCase().replace(/\s+/g, '-')}`}>
                      Practice this topic <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <SectionHeader
            title="Recent Activity"
            description="Your latest practice sessions and exams"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statistics.recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{activity.title}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(activity.date)}
                    <Badge variant={activity.type === "exam" ? "default" : "secondary"} className="text-xs">
                      {activity.type === "exam" ? "Full Exam" : "Practice"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    activity.percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {activity.percentage}%
                  </div>
                  <div className="text-sm">
                    <div>{activity.score}/{activity.total}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/exams/attempts/${activity.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <Button variant="outline" asChild className="ml-auto">
            <Link href="/dashboard/exams">
              View All Activity
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
