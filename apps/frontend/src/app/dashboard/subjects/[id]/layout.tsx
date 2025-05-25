"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

// Mock data for a subject
const mockSubjectData = {
  id: "1",
  name: "Anatomy",
  description: "Study of the structure of the human body",
  totalQuestions: 250,
  completedQuestions: 125,
  averageScore: 78,
};

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const [subjectData, setSubjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id: subjectId } = params;

  // Determine if we're in a practice exam
  const isPractice = pathname.includes("/practice");
  
  // Determine active tab based on the current pathname
  const getActiveTab = () => {
    if (pathname.endsWith(`/subjects/${subjectId}`)) return "overview";
    if (pathname.includes("/content")) return "content";
    if (pathname.includes("/practice")) return "practice";
    if (pathname.includes("/statistics")) return "statistics";
    return "overview";
  };

  // Fetch subject data
  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setSubjectData(mockSubjectData);
      } catch (error) {
        console.error("Error fetching subject:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId]);

  // If we're in a practice exam, just render the children without the tabs
  if (isPractice) {
    return <div className="mx-auto max-w-7xl">{children}</div>;
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading subject...</p>
        </div>
      </div>
    );
  }

  if (!subjectData) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <h2 className="text-xl font-semibold">Subject not found</h2>
        <p className="mt-2 text-muted-foreground">
          The subject you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/subjects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/dashboard/subjects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Subjects
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{subjectData.name}</h1>
          <p className="text-muted-foreground">{subjectData.description}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" value={getActiveTab()}>
        <TabsList>
          <Link href={`/dashboard/subjects/${subjectId}`} passHref>
            <TabsTrigger value="overview" asChild>
              <div>Overview</div>
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/subjects/${subjectId}/content`} passHref>
            <TabsTrigger value="content" asChild>
              <div>Content</div>
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/subjects/${subjectId}/practice`} passHref>
            <TabsTrigger value="practice" asChild>
              <div>Practice</div>
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/subjects/${subjectId}/statistics`} passHref>
            <TabsTrigger value="statistics" asChild>
              <div>Statistics</div>
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
