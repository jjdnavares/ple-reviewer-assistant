"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Loader2,
  Book,
  Clock,
  AlertCircle,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { ExamNavigation } from "@/components/exam/ExamNavigation";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// Mock data for anatomy subject exam
const mockExamData = {
  id: "exam101",
  title: "Anatomy Practice Exam",
  subject: {
    id: "1",
    name: "Anatomy"
  },
  timeLimit: 3600, // 1 hour in seconds
  questions: [
    {
      id: "q1",
      text: "Which of the following structures passes through the carpal tunnel?",
      options: [
        { id: "q1-a", text: "Ulnar nerve" },
        { id: "q1-b", text: "Median nerve" },
        { id: "q1-c", text: "Radial nerve" },
        { id: "q1-d", text: "Ulnar artery" }
      ],
      correctOption: "q1-b",
      explanation: "The median nerve passes through the carpal tunnel along with the flexor tendons. The ulnar nerve and artery pass through the Guyon's canal, while the radial nerve does not enter the wrist at this level."
    },
    {
      id: "q2",
      text: "The femoral artery passes beneath which of the following structures?",
      options: [
        { id: "q2-a", text: "Inguinal ligament" },
        { id: "q2-b", text: "Adductor magnus" },
        { id: "q2-c", text: "Sartorius" },
        { id: "q2-d", text: "Femoral vein" }
      ],
      correctOption: "q2-a",
      explanation: "The femoral artery passes beneath the inguinal ligament to enter the femoral triangle. The mnemonic NAVEL (from lateral to medial: femoral Nerve, femoral Artery, femoral Vein, Empty space, Lymphatics) helps remember the relationship at the femoral triangle."
    },
    {
      id: "q3",
      text: "Which cranial nerve carries parasympathetic fibers to the parotid gland?",
      options: [
        { id: "q3-a", text: "Facial nerve (CN VII)" },
        { id: "q3-b", text: "Glossopharyngeal nerve (CN IX)" },
        { id: "q3-c", text: "Vagus nerve (CN X)" },
        { id: "q3-d", text: "Trigeminal nerve (CN V)" }
      ],
      correctOption: "q3-a",
      explanation: "The facial nerve (CN VII) carries parasympathetic fibers to the parotid gland via the auriculotemporal branch of V3. The glossopharyngeal nerve (CN IX) supplies the submandibular and sublingual glands, while the vagus nerve (CN X) supplies the thoracic and abdominal viscera."
    },
    {
      id: "q4",
      text: "The coronary sinus primarily drains into which cardiac chamber?",
      options: [
        { id: "q4-a", text: "Right atrium" },
        { id: "q4-b", text: "Left atrium" },
        { id: "q4-c", text: "Right ventricle" },
        { id: "q4-d", text: "Left ventricle" }
      ],
      correctOption: "q4-a",
      explanation: "The coronary sinus is the main venous drainage of the heart and empties directly into the right atrium. It receives blood from the great, middle, and small cardiac veins."
    },
    {
      id: "q5",
      text: "Which of the following muscles is NOT part of the rotator cuff?",
      options: [
        { id: "q5-a", text: "Supraspinatus" },
        { id: "q5-b", text: "Infraspinatus" },
        { id: "q5-c", text: "Deltoid" },
        { id: "q5-d", text: "Teres minor" }
      ],
      correctOption: "q5-c",
      explanation: "The rotator cuff consists of four muscles: supraspinatus, infraspinatus, teres minor, and subscapularis (the SITS muscles). The deltoid is not part of the rotator cuff; it is a powerful shoulder abductor that forms the rounded contour of the shoulder."
    }
  ]
};

// Exam states
type ExamState = "setup" | "inProgress" | "review" | "completed";

export default function PracticeExamPage() {
  const params = useParams();
  const router = useRouter();
  const { id: subjectId } = params;
  const { toast } = useToast();
  
  // State
  const [examState, setExamState] = useState<ExamState>("setup");
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(3600); // Default 1 hour
  const [examScore, setExamScore] = useState({
    correct: 0,
    total: 0,
    percentage: 0,
  });
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Fetch exam data
  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExamData(mockExamData);
        setTimeRemaining(mockExamData.timeLimit);
      } catch (error) {
        console.error("Error fetching exam:", error);
        toast({
          title: "Error",
          description: "Failed to load exam data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [subjectId, toast]);

  // Handle starting the exam
  const startExam = () => {
    setExamState("inProgress");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlaggedQuestions([]);
  };

  // Handle answering a question
  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Handle flagging a question
  const handleFlagQuestion = (questionId: string, isFlagged: boolean) => {
    if (isFlagged) {
      setFlaggedQuestions(prev => [...prev, questionId]);
    } else {
      setFlaggedQuestions(prev => prev.filter(id => id !== questionId));
    }
  };

  // Handle navigating to a specific question
  const navigateToQuestion = (questionNumber: number) => {
    setCurrentQuestionIndex(questionNumber - 1);
  };

  // Handle time up
  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Your exam time has ended. Let's review your answers.",
      variant: "default",
    });
    submitExam();
  };

  // Submit exam
  const submitExam = () => {
    // Calculate score
    const totalQuestions = examData.questions.length;
    let correctCount = 0;

    examData.questions.forEach((question: any, index: number) => {
      if (answers[question.id] === question.correctOption) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    setExamScore({
      correct: correctCount,
      total: totalQuestions,
      percentage
    });

    setExamState("review");
    setCurrentQuestionIndex(0);
  };

  // Complete exam and return to subject page
  const completeExam = () => {
    router.push(`/dashboard/subjects/${subjectId}`);
  };

  // Get current question data
  const currentQuestion = examData?.questions[currentQuestionIndex];
  
  // List of answered question IDs
  const answeredQuestionIds = Object.keys(answers);

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading practice exam...</span>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center">
        <Book className="h-16 w-16 text-muted-foreground/60" />
        <h2 className="mt-4 text-xl font-semibold">Exam not found</h2>
        <p className="mt-2 text-muted-foreground">
          The exam you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-4" asChild>
          <Link href={`/dashboard/subjects/${subjectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subject
          </Link>
        </Button>
      </div>
    );
  }

  // Exam Setup Screen
  if (examState === "setup") {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" asChild className="mb-2">
          <Link href={`/dashboard/subjects/${subjectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subject
          </Link>
        </Button>
        
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
          <Book className="h-16 w-16 text-primary" />
          <h1 className="text-3xl font-bold">{examData.title}</h1>
          <p className="text-xl text-muted-foreground">
            {examData.subject.name}
          </p>
          
          <Card className="max-w-2xl w-full p-6 mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Total Questions</span>
                <span>{examData.questions.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Time Limit</span>
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {Math.floor(examData.timeLimit / 60)} minutes
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Subject</span>
                <span>{examData.subject.name}</span>
              </div>
              
              <div className="pt-4 space-y-2">
                <h3 className="font-semibold flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                  Exam Instructions
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• You have {Math.floor(examData.timeLimit / 60)} minutes to complete this exam.</li>
                  <li>• You can flag questions to review later.</li>
                  <li>• Your progress is automatically saved.</li>
                  <li>• Once submitted, you'll see your score and can review all questions with explanations.</li>
                </ul>
              </div>
              
              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={startExam}
                >
                  Start Exam
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Exam In Progress or Review
  return (
    <div className="space-y-6">
      {/* Header with timer and navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">{examData.title}</h1>
          <p className="text-muted-foreground">
            {examData.subject.name} {examState === "review" ? "- Review Mode" : ""}
          </p>
        </div>
        
        {examState === "inProgress" && (
          <div className="flex items-center gap-2">
            <div className="border rounded-md p-2 bg-card w-40">
              <ExamTimer 
                durationInSeconds={examData.timeLimit}
                onTimeUp={handleTimeUp}
                isPaused={examState !== "inProgress"}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowExitDialog(true)}
            >
              Exit
            </Button>
          </div>
        )}
        
        {examState === "review" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm px-3 py-1.5 bg-card border rounded-md">
              <span>Score:</span>
              <span className="font-bold text-lg">
                {examScore.percentage}%
              </span>
              <span className="text-muted-foreground ml-1">
                ({examScore.correct}/{examScore.total})
              </span>
            </div>
            <Button onClick={completeExam}>
              Finish Review
            </Button>
          </div>
        )}
      </div>
      
      {/* Main content - Question and Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          {currentQuestion && (
            <QuestionCard
              id={currentQuestion.id}
              number={currentQuestionIndex + 1}
              text={currentQuestion.text}
              options={currentQuestion.options}
              selectedOption={answers[currentQuestion.id]}
              isFlagged={flaggedQuestions.includes(currentQuestion.id)}
              isReview={examState === "review"}
              correctOption={examState === "review" ? currentQuestion.correctOption : undefined}
              explanation={examState === "review" ? currentQuestion.explanation : undefined}
              onSelectOption={handleSelectOption}
              onFlagQuestion={handleFlagQuestion}
            />
          )}
        </div>
        
        <div className="col-span-1">
          <ExamNavigation
            totalQuestions={examData.questions.length}
            currentQuestion={currentQuestionIndex + 1}
            flaggedQuestions={flaggedQuestions}
            answeredQuestions={answeredQuestionIds}
            timeRemaining={timeRemaining}
            isReview={examState === "review"}
            onNavigate={navigateToQuestion}
            onSubmit={examState === "inProgress" ? submitExam : undefined}
          />
        </div>
      </div>
      
      {/* Exit confirmation dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Exam?</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit this exam? Your progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowExitDialog(false)}
            >
              Continue Exam
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => router.push(`/dashboard/subjects/${subjectId}`)}
            >
              Exit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
