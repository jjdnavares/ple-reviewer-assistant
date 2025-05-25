"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Book, 
  Search, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for subjects
const mockSubjects = [
  {
    id: "1",
    name: "Anatomy",
    description: "Study of the structure of the human body",
    topicCount: 24,
    questionCount: 450,
    progress: 65
  },
  {
    id: "2",
    name: "Physiology",
    description: "Study of the function of body parts and the body as a whole",
    topicCount: 18,
    questionCount: 380,
    progress: 42
  },
  {
    id: "3",
    name: "Pathology",
    description: "Study of the causes and effects of disease or injury",
    topicCount: 30,
    questionCount: 520,
    progress: 28
  },
  {
    id: "4",
    name: "Pharmacology",
    description: "Study of drug action on living systems",
    topicCount: 22,
    questionCount: 410,
    progress: 15
  },
  {
    id: "5",
    name: "Microbiology",
    description: "Study of microorganisms including bacteria, viruses, fungi and parasites",
    topicCount: 20,
    questionCount: 350,
    progress: 38
  },
  {
    id: "6",
    name: "Biochemistry",
    description: "Study of chemical processes in living organisms",
    topicCount: 15,
    questionCount: 280,
    progress: 45
  },
  {
    id: "7",
    name: "Internal Medicine",
    description: "Diagnosis and treatment of adult diseases",
    topicCount: 35,
    questionCount: 680,
    progress: 22
  },
  {
    id: "8",
    name: "Surgery",
    description: "Medical specialty that uses operative manual and instrumental techniques",
    topicCount: 28,
    questionCount: 520,
    progress: 18
  },
  {
    id: "9",
    name: "Obstetrics & Gynecology",
    description: "Medical specialty dealing with pregnancy, childbirth, and female reproductive system",
    topicCount: 25,
    questionCount: 480,
    progress: 30
  },
  {
    id: "10",
    name: "Pediatrics",
    description: "Branch of medicine dealing with the health and medical care of infants, children, and adolescents",
    topicCount: 26,
    questionCount: 510,
    progress: 25
  },
  {
    id: "11",
    name: "Psychiatry",
    description: "Medical specialty devoted to the diagnosis, prevention, and treatment of mental disorders",
    topicCount: 18,
    questionCount: 320,
    progress: 10
  },
  {
    id: "12",
    name: "Emergency Medicine",
    description: "Medical specialty involving care for undifferentiated and unscheduled patients with acute illnesses or injuries",
    topicCount: 22,
    questionCount: 430,
    progress: 5
  }
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(mockSubjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter subjects based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSubjects(mockSubjects);
    } else {
      const filtered = mockSubjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSubjects(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Subjects</h1>
          <p className="text-muted-foreground">
            Review subjects and topics for your medical licensure exam
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search subjects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading subjects...</span>
        </div>
      ) : subjects.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center text-center">
          <Book className="h-16 w-16 text-muted-foreground/60" />
          <h3 className="mt-4 text-lg font-semibold">No subjects found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link 
              key={subject.id} 
              href={`/dashboard/subjects/${subject.id}`}
              className="transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-primary" />
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {subject.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm">
                    <span>{subject.topicCount} Topics</span>
                    <span>{subject.questionCount} Questions</span>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto gap-1 text-xs"
                  >
                    View Topics <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
