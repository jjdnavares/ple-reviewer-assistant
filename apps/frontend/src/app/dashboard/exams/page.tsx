"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search,
  Loader2,
  Clock,
  CalendarIcon,
  Filter,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Mock data for exams
const mockExams = [
  {
    id: "1",
    title: "Comprehensive Medical Licensure Exam",
    description: "Full-length practice exam covering all subjects",
    questionCount: 200,
    timeLimit: 240, // minutes
    subjects: ["Anatomy", "Physiology", "Pathology", "Pharmacology", "Internal Medicine"],
    difficulty: "Hard",
    published: true,
    attempts: 124,
    avgScore: 76,
    createdAt: "2025-05-01T08:00:00Z"
  },
  {
    id: "2",
    title: "Anatomy Quick Assessment",
    description: "Short practice exam focused on human anatomy",
    questionCount: 50,
    timeLimit: 60, // minutes
    subjects: ["Anatomy"],
    difficulty: "Medium",
    published: true,
    attempts: 230,
    avgScore: 82,
    createdAt: "2025-05-05T10:15:00Z"
  },
  {
    id: "3",
    title: "Pharmacology Practice Test",
    description: "Comprehensive review of clinical pharmacology",
    questionCount: 75,
    timeLimit: 90, // minutes
    subjects: ["Pharmacology"],
    difficulty: "Hard",
    published: true,
    attempts: 98,
    avgScore: 68,
    createdAt: "2025-05-10T14:30:00Z"
  },
  {
    id: "4",
    title: "Clinical Diagnosis Challenge",
    description: "Case-based questions focused on clinical diagnosis",
    questionCount: 100,
    timeLimit: 120, // minutes
    subjects: ["Internal Medicine", "Pathology", "Radiology"],
    difficulty: "Hard",
    published: true,
    attempts: 75,
    avgScore: 71,
    createdAt: "2025-05-15T09:45:00Z"
  },
  {
    id: "5",
    title: "Physiology Essentials",
    description: "Core concepts in human physiology",
    questionCount: 60,
    timeLimit: 75, // minutes
    subjects: ["Physiology"],
    difficulty: "Medium",
    published: true,
    attempts: 145,
    avgScore: 79,
    createdAt: "2025-05-18T13:20:00Z"
  }
];

// Mock data for user's recent exam attempts
const mockRecentAttempts = [
  {
    id: "at1",
    examId: "2",
    examTitle: "Anatomy Quick Assessment",
    score: 40,
    total: 50,
    percentage: 80,
    date: "2025-05-20T15:30:00Z",
    status: "completed",
    timeTaken: 52 // minutes
  },
  {
    id: "at2",
    examId: "3",
    examTitle: "Pharmacology Practice Test",
    score: 45,
    total: 75,
    percentage: 60,
    date: "2025-05-18T10:15:00Z",
    status: "completed",
    timeTaken: 85 // minutes
  }
];

export default function ExamsPage() {
  const [exams, setExams] = useState(mockExams);
  const [recentAttempts, setRecentAttempts] = useState(mockRecentAttempts);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter exams based on search query and filters
  useEffect(() => {
    let filtered = [...mockExams];
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(exam => 
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(exam => 
        exam.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }
    
    // Apply subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter(exam => 
        exam.subjects.some(subject => 
          subject.toLowerCase().includes(subjectFilter.toLowerCase())
        )
      );
    }
    
    setExams(filtered);
  }, [searchQuery, difficultyFilter, subjectFilter]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice Exams</h1>
          <p className="text-muted-foreground">
            Prepare for your medical licensure exam with comprehensive practice tests
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search exams..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="anatomy">Anatomy</SelectItem>
              <SelectItem value="physiology">Physiology</SelectItem>
              <SelectItem value="pathology">Pathology</SelectItem>
              <SelectItem value="pharmacology">Pharmacology</SelectItem>
              <SelectItem value="internal medicine">Internal Medicine</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Attempts</h2>
        
        {recentAttempts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-semibold">No recent attempts</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start practicing to see your recent exam attempts here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentAttempts.map((attempt) => (
              <Card key={attempt.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{attempt.examTitle}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {formatDate(attempt.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        attempt.percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {attempt.percentage}%
                      </div>
                      <div>
                        <div className="font-medium">{attempt.score}/{attempt.total}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{attempt.timeTaken} min</div>
                      <div className="text-xs text-muted-foreground">Time Taken</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-3">
                  <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <Link href={`/dashboard/exams/attempts/${attempt.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Exams */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Exams</h2>
        
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading exams...</span>
          </div>
        ) : exams.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center text-center">
            <FileText className="h-16 w-16 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-semibold">No exams found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <Card key={exam.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{exam.title}</CardTitle>
                    <Badge variant={exam.difficulty === "Hard" ? "destructive" : exam.difficulty === "Medium" ? "default" : "outline"}>
                      {exam.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{exam.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.questionCount} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.timeLimit} Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Avg. Score: {exam.avgScore}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.attempts} Attempts</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {exam.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/exams/${exam.id}`}>
                      Start Exam
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
