"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  BookOpen,
  Search,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageContainer, SectionHeader } from "@/components/layout";

// Topic type definition
interface SubTopic {
  id: string;
  name: string;
  questionCount: number;
  progress: number;
}

interface Topic {
  id: string;
  name: string;
  description: string;
  progress: number;
  questionCount: number;
  subtopics: SubTopic[];
}

// Mock data (same as in subject detail page)
const mockTopics: Topic[] = [
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
];

// Mock resources
const mockResources = [
  {
    id: "r1",
    title: "Clinical Anatomy: A Comprehensive Review",
    type: "Book",
    author: "Dr. Maria Rodriguez",
    rating: 4.8,
    popular: true
  },
  {
    id: "r2",
    title: "Anatomy Atlas: 3D Interactive",
    type: "Interactive",
    author: "Medical Education Group",
    rating: 4.6,
    popular: true
  },
  {
    id: "r3",
    title: "Review of Human Anatomy",
    type: "PDF",
    author: "Dr. James Chen",
    rating: 4.2,
    popular: false
  }
];

export default function SubjectContentPage() {
  const params = useParams();
  const { id: subjectId } = params;
  
  const [topics, setTopics] = useState<Topic[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch topic data
  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setTopics(mockTopics);
        setResources(mockResources);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [subjectId]);

  // Toggle topic expansion
  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => 
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Filter topics based on search
  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.subtopics.some(subtopic => 
      subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading content...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      {/* Search and Info */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search topics..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <Link href={`/dashboard/subjects/${subjectId}/practice`}>
            <BookOpen className="h-4 w-4" />
            Practice All Topics
          </Link>
        </Button>
      </div>

      {/* Topics List */}
      <div className="mb-4">
        <SectionHeader 
          title="Topics" 
          description="Browse all available topics for this subject"
        />
      </div>
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-semibold">No topics found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search query
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTopics.map((topic) => (
            <Card key={topic.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div 
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => toggleTopic(topic.id)}
                >
                  <div>
                    <CardTitle>{topic.name}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedTopics.includes(topic.id) ? 
                      <ChevronUp className="h-5 w-5" /> : 
                      <ChevronDown className="h-5 w-5" />
                    }
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{topic.questionCount} Questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{topic.progress}% Complete</span>
                    </div>
                  </div>
                  <div className="w-32 md:w-48">
                    <Progress value={topic.progress} className="h-2" />
                  </div>
                </div>
                
                {expandedTopics.includes(topic.id) && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="mb-2 text-sm font-medium">Subtopics</h4>
                    <div className="space-y-3">
                      {topic.subtopics.map((subtopic) => (
                        <div key={subtopic.id} className="flex items-center justify-between rounded-md border p-2">
                          <div>
                            <div className="font-medium">{subtopic.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {subtopic.questionCount} questions
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs">
                              {subtopic.progress}%
                            </div>
                            <div className="w-24">
                              <Progress value={subtopic.progress} className="h-1.5" />
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/subjects/${subjectId}/practice?topic=${subtopic.id}`}>
                                Practice
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className={expandedTopics.includes(topic.id) ? "border-t bg-muted/50 p-3" : "hidden"}>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/subjects/${subjectId}/practice?topic=${topic.id}`}>
                    Practice This Topic
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Recommended Resources */}
      <div>
        <SectionHeader 
          title="Recommended Resources" 
          description="Helpful study materials for this subject"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                  {resource.popular && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardDescription>{resource.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary">{resource.type}</Badge>
                  <div className="flex items-center">
                    <span className="text-amber-500">★</span>
                    <span className="ml-1">{resource.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Resource
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
