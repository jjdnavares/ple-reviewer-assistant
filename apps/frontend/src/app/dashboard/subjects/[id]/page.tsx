"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Book, 
  ChevronRight,
  FileText,
  CheckCircle,
  Clock,
  ListTodo,
  Brain,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DoctorBot } from "@/components/ai/DoctorBot";
import { PageContainer, SectionHeader, StatCard } from "@/components/layout";

// Define Subject type
type SubjectDetail = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  topicCount: number;
  questionCount: number;
  progress: number;
  lastStudied: string;
  topics: Array<{
    id: string;
    name: string;
    description: string;
    progress: number;
    questionCount: number;
    subtopics: Array<{
      id: string;
      name: string;
      questionCount: number;
      progress: number;
    }>;
  }>;
  recentQuestions: Array<{
    id: string;
    text: string;
    difficulty: string;
    lastAnswered: string;
    correct: boolean;
  }>;
};

// Mock data with proper typing
const mockSubjectDetails: Record<string, SubjectDetail> = {
  "1": {
    id: "1",
    name: "Anatomy",
    description: "Study of the structure of the human body",
    longDescription: "Anatomy is the branch of biology concerned with the study of the structure of organisms and their parts. Human anatomy is primarily the scientific study of the morphology of the human body. Anatomy is subdivided into gross anatomy and microscopic anatomy. Gross anatomy is the examination of an animal's body parts using unaided eyesight. Microscopic anatomy involves the use of optical instruments in the study of the tissues of various structures.",
    topicCount: 24,
    questionCount: 450,
    progress: 65,
    lastStudied: "2025-05-15T10:30:00",
    topics: [
      {
        id: "101",
        name: "Musculoskeletal System",
        description: "Bones, muscles, and connective tissues",
        progress: 75,
        questionCount: 85,
        subtopics: [
          { id: "1011", name: "Upper Limb", questionCount: 25, progress: 80 },
          { id: "1012", name: "Lower Limb", questionCount: 30, progress: 70 },
          { id: "1013", name: "Spine and Thorax", questionCount: 30, progress: 75 }
        ]
      },
      {
        id: "102",
        name: "Cardiovascular System",
        description: "Heart, blood vessels, and circulation",
        progress: 60,
        questionCount: 90,
        subtopics: [
          { id: "1021", name: "Heart Anatomy", questionCount: 35, progress: 65 },
          { id: "1022", name: "Vascular System", questionCount: 30, progress: 55 },
          { id: "1023", name: "Fetal Circulation", questionCount: 25, progress: 60 }
        ]
      },
      {
        id: "103",
        name: "Respiratory System",
        description: "Lungs and respiratory passages",
        progress: 70,
        questionCount: 75,
        subtopics: [
          { id: "1031", name: "Upper Respiratory Tract", questionCount: 25, progress: 75 },
          { id: "1032", name: "Lower Respiratory Tract", questionCount: 30, progress: 65 },
          { id: "1033", name: "Mechanics of Breathing", questionCount: 20, progress: 70 }
        ]
      },
      {
        id: "104",
        name: "Nervous System",
        description: "Brain, spinal cord, and nerves",
        progress: 55,
        questionCount: 110,
        subtopics: [
          { id: "1041", name: "Central Nervous System", questionCount: 40, progress: 60 },
          { id: "1042", name: "Peripheral Nervous System", questionCount: 35, progress: 50 },
          { id: "1043", name: "Autonomic Nervous System", questionCount: 35, progress: 55 }
        ]
      },
      {
        id: "105",
        name: "Digestive System",
        description: "Gastrointestinal tract and accessory organs",
        progress: 65,
        questionCount: 90,
        subtopics: [
          { id: "1051", name: "Upper GI Tract", questionCount: 30, progress: 70 },
          { id: "1052", name: "Lower GI Tract", questionCount: 30, progress: 60 },
          { id: "1053", name: "Accessory Organs", questionCount: 30, progress: 65 }
        ]
      }
    ],
    recentQuestions: [
      {
        id: "q1",
        text: "Which of the following structures passes through the carpal tunnel?",
        difficulty: "MEDIUM",
        lastAnswered: "2025-05-14T14:20:00",
        correct: true
      },
      {
        id: "q2",
        text: "The femoral artery passes beneath which of the following structures?",
        difficulty: "HARD",
        lastAnswered: "2025-05-13T09:45:00",
        correct: false
      },
      {
        id: "q3",
        text: "Which cranial nerve carries parasympathetic fibers to the parotid gland?",
        difficulty: "HARD",
        lastAnswered: "2025-05-12T16:30:00",
        correct: true
      }
    ]
  }
};

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  // Fetch subject data
  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const subjectData = mockSubjectDetails[id as string];
        if (subjectData) {
          setSubject(subjectData);
        } else {
          // Subject not found, redirect to subjects list
          router.push("/dashboard/subjects");
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id, router]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading || !subject) {
    return null; // Loading and error states are handled by the layout
  }

  return (
    <PageContainer className="space-y-6">
      {/* AI Assistant - Conditionally rendered */}
      {showChat && (
        <div className="mb-6">
          <DoctorBot subjectId={subject.id} />
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={FileText} 
          value={subject.questionCount} 
          label="Total Questions" 
        />

        <StatCard 
          icon={Book} 
          value={subject.topicCount} 
          label="Topics" 
        />

        <StatCard 
          icon={CheckCircle} 
          value={`${subject.progress}%`} 
          label="Progress" 
        />

        <StatCard 
          icon={Clock} 
          value={formatDate(subject.lastStudied)} 
          label="Last Studied" 
          variant="muted" 
        />
      </div>

      {/* Subject Description & Recent Questions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Subject Info */}
        <Card>
          <CardHeader>
            <SectionHeader 
              title="Subject Information" 
              action={{
                href: `/dashboard/subjects/${subject.id}/content`,
                label: "Browse Content"
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <p>{subject.longDescription}</p>
          </CardContent>
        </Card>

        {/* Recent Questions */}
        <Card>
          <CardHeader>
            <SectionHeader 
              title="Recent Questions" 
              description="Your recent performance in this subject"
              action={{
                href: `/dashboard/subjects/${subject.id}/practice`,
                label: "Practice Questions"
              }}
            />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {subject.recentQuestions.map((question: any) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    {question.correct ? (
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-sm">{question.text}</p>
                  </div>
                  <div className="flex items-center justify-between pl-6 text-xs text-muted-foreground">
                    <span>
                      Difficulty: {question.difficulty.charAt(0) + question.difficulty.slice(1).toLowerCase()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDate(question.lastAnswered)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Quick Actions Section */}
      <div className="mb-4">
        <SectionHeader title="Quick Actions" description="Choose what you want to do next" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Practice Exam</CardTitle>
            <CardDescription>
              Test your knowledge on this subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>{subject.questionCount} questions available</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Timed or untimed mode</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/dashboard/subjects/${subject.id}/practice`}>
                Start Practice Exam
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Study Content</CardTitle>
            <CardDescription>
              Review topics and educational materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <Book className="h-4 w-4 text-primary" />
                <span>{subject.topics.length} topics available</span>
              </li>
              <li className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-primary" />
                <span>Structured learning path</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/dashboard/subjects/${subject.id}/content`}>
                Browse Content
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AI Tutor</CardTitle>
            <CardDescription>
              Get personalized explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Ask questions about topics</span>
              </li>
              <li className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span>Verify your understanding</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setShowChat(true)}>
              Chat with AI Tutor
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
