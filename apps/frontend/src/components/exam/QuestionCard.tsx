"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Flag, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  text: string;
}

interface QuestionCardProps {
  id: string;
  number: number;
  text: string;
  options: Option[];
  selectedOption?: string;
  isFlagged?: boolean;
  isReview?: boolean;
  correctOption?: string;
  explanation?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
  onFlagQuestion: (questionId: string, isFlagged: boolean) => void;
}

export function QuestionCard({
  id,
  number,
  text,
  options,
  selectedOption,
  isFlagged = false,
  isReview = false,
  correctOption,
  explanation,
  onSelectOption,
  onFlagQuestion,
}: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionChange = (optionId: string) => {
    onSelectOption(id, optionId);
  };

  const toggleFlag = () => {
    onFlagQuestion(id, !isFlagged);
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">Question {number}</div>
          {isReview && selectedOption && (
            <div 
              className={cn(
                "px-2 py-1 text-xs font-semibold rounded-full",
                selectedOption === correctOption 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              )}
            >
              {selectedOption === correctOption ? (
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Correct
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Incorrect
                </span>
              )}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "p-0 h-9 w-9",
            isFlagged && "text-yellow-500 hover:text-yellow-600"
          )}
          onClick={toggleFlag}
        >
          <Flag
            className={cn("h-5 w-5", isFlagged && "fill-yellow-500")}
          />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-base mb-4">{text}</div>
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionChange}
          className="space-y-3"
        >
          {options.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex items-start space-x-2 p-2 rounded-md",
                isReview && option.id === correctOption && "bg-green-50 dark:bg-green-900/20",
                isReview && selectedOption === option.id && option.id !== correctOption && "bg-red-50 dark:bg-red-900/20"
              )}
            >
              <RadioGroupItem
                value={option.id}
                id={option.id}
                disabled={isReview}
                className="mt-1"
              />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer text-base font-normal"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {isReview && explanation && (
          <div className="mt-6">
            <Button
              variant="outline"
              className="mb-2"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </Button>
            {showExplanation && (
              <div className="p-4 border rounded-md bg-muted/50">
                <h4 className="font-semibold mb-2">Explanation</h4>
                <p className="text-sm">{explanation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
