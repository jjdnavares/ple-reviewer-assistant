"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ExamTimerProps {
  durationInSeconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function ExamTimer({ 
  durationInSeconds, 
  onTimeUp,
  isPaused = false
}: ExamTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationInSeconds);
  const [isWarning, setIsWarning] = useState(false);
  const { toast } = useToast();

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer logic
  const tick = useCallback(() => {
    if (isPaused) return;

    setTimeRemaining((prevTime) => {
      if (prevTime <= 1) {
        onTimeUp();
        return 0;
      }
      return prevTime - 1;
    });
  }, [isPaused, onTimeUp]);

  // Set up timer
  useEffect(() => {
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [tick]);

  // Handle warnings
  useEffect(() => {
    // Show warning at 10 minutes and 5 minutes
    const warningThresholds = [600, 300];
    
    if (warningThresholds.includes(timeRemaining)) {
      setIsWarning(true);
      
      const minutesLeft = timeRemaining / 60;
      toast({
        title: `${minutesLeft} minutes remaining!`,
        description: "Please review your answers and complete the exam.",
        variant: "warning",
      });
      
      // Reset warning after 5 seconds
      const warningTimer = setTimeout(() => {
        setIsWarning(false);
      }, 5000);
      
      return () => clearTimeout(warningTimer);
    }
    
    // Continuous warning for last minute
    if (timeRemaining <= 60) {
      setIsWarning(true);
    }
  }, [timeRemaining, toast]);

  // Calculate percentage for progress indicator
  const percentage = Math.max(0, (timeRemaining / durationInSeconds) * 100);

  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "text-2xl font-mono font-bold transition-colors",
          timeRemaining <= 300 && "text-red-500",
          isWarning && "animate-pulse"
        )}
      >
        {formatTime(timeRemaining)}
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all",
            percentage > 50 ? "bg-green-500" : 
            percentage > 25 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
