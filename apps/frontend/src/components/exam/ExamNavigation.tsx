"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle, 
  Clock,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ExamNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  flaggedQuestions: string[];
  answeredQuestions: string[];
  timeRemaining: number; // in seconds
  isReview?: boolean;
  onNavigate: (questionNumber: number) => void;
  onSubmit?: () => void;
}

export function ExamNavigation({
  totalQuestions,
  currentQuestion,
  flaggedQuestions,
  answeredQuestions,
  timeRemaining,
  isReview = false,
  onNavigate,
  onSubmit,
}: ExamNavigationProps) {
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const { toast } = useToast();
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress
  const progress = (answeredQuestions.length / totalQuestions) * 100;
  
  // Generate question buttons
  const questionButtons = Array.from({ length: totalQuestions }, (_, i) => {
    const questionNumber = i + 1;
    const questionId = questionNumber.toString();
    const isFlagged = flaggedQuestions.includes(questionId);
    const isAnswered = answeredQuestions.includes(questionId);
    const isCurrent = currentQuestion === questionNumber;
    
    return (
      <Button
        key={questionNumber}
        variant={isCurrent ? "default" : "outline"}
        size="sm"
        className={cn(
          "w-10 h-10 m-1 relative",
          isAnswered && !isCurrent && "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
          isFlagged && "ring-2 ring-yellow-400 dark:ring-yellow-500"
        )}
        onClick={() => onNavigate(questionNumber)}
      >
        {questionNumber}
        {isFlagged && (
          <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
        )}
      </Button>
    );
  });
  
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      onNavigate(currentQuestion - 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      onNavigate(currentQuestion + 1);
    }
  };
  
  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - answeredQuestions.length;
    
    if (unansweredCount > 0 && !showConfirmSubmit) {
      setShowConfirmSubmit(true);
      toast({
        title: "Warning",
        description: `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`,
        variant: "destructive",
      });
      return;
    }
    
    if (onSubmit) {
      onSubmit();
    }
    setShowConfirmSubmit(false);
  };
  
  return (
    <div className="w-full bg-card border rounded-lg p-4 shadow-sm">
      {/* Time and Progress Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className={cn(
            "font-mono text-lg",
            timeRemaining < 300 && !isReview && "text-red-500 font-bold animate-pulse"
          )}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>
            {answeredQuestions.length}/{totalQuestions} ({Math.round(progress)}%)
          </span>
        </div>
      </div>
      
      {/* Questions Grid */}
      <div className="flex flex-wrap justify-center mb-4">
        {questionButtons}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 1}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Previous
        </Button>
        
        {!isReview && (
          <Button
            variant={showConfirmSubmit ? "destructive" : "default"}
            onClick={handleSubmitClick}
            className={cn("mx-2", showConfirmSubmit && "animate-pulse")}
          >
            {showConfirmSubmit ? (
              <>
                <AlertTriangle className="h-5 w-5 mr-1" />
                Confirm Submit
              </>
            ) : (
              "Submit Exam"
            )}
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentQuestion === totalQuestions}
        >
          Next
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
