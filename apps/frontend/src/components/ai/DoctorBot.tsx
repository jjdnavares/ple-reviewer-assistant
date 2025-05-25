"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Send, Bot, User, Loader2, ArrowDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Source {
  id: string;
  title: string;
  source: string;
}

interface DoctorBotProps {
  subjectId?: string;
  questionId?: string;
  initialContext?: string;
}

export function DoctorBot({ 
  subjectId, 
  questionId, 
  initialContext 
}: DoctorBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Dr. Bot, your medical exam assistant. How can I help you with your exam preparation today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if should show scroll button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isScrolledUp = target.scrollHeight - target.scrollTop - target.clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a response
      
      // In a real implementation, you would:
      // 1. Call the backend API
      // 2. Get the response from the LLM
      // 3. Update the sources if provided
      
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: simulateResponse(input, subjectId),
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botResponse]);
        
        // Simulate sources
        setSources([
          {
            id: "src1",
            title: "Medical Pathophysiology",
            source: "textbook"
          },
          {
            id: "src2",
            title: "Clinical Diagnosis Guide",
            source: "question_bank"
          }
        ]);
        
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        },
      ]);
      
      setIsLoading(false);
    }
  };

  // Format message timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] rounded-xl border shadow-sm">
      <CardHeader className="px-4 py-3 border-b flex flex-row items-center">
        <Bot className="h-5 w-5 mr-2 text-primary" />
        <h3 className="font-semibold">Dr. Bot - Medical Assistant</h3>
      </CardHeader>
      
      <CardContent 
        className="flex-1 overflow-y-auto p-4 space-y-4" 
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3 group",
              message.role === "assistant" ? "justify-start" : "justify-end"
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </Avatar>
            )}
            
            <div 
              className={cn(
                "p-3 rounded-lg max-w-[80%]",
                message.role === "assistant" 
                  ? "bg-muted text-foreground" 
                  : "bg-primary text-primary-foreground"
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div 
                className={cn(
                  "text-xs mt-1 opacity-70",
                  message.role === "assistant" 
                    ? "text-foreground" 
                    : "text-primary-foreground"
                )}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
            
            {message.role === "user" && (
              <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground">
                <User className="h-4 w-4" />
              </Avatar>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </Avatar>
            <div className="p-3 rounded-lg bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        
        {sources.length > 0 && (
          <div className="border rounded-lg p-3 mt-4 bg-muted/50">
            <h4 className="text-sm font-semibold mb-2">Sources</h4>
            <ul className="space-y-1">
              {sources.map((source) => (
                <li key={source.id} className="text-xs text-muted-foreground">
                  • {source.title} ({source.source})
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Anchor for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </CardContent>
      
      {showScrollButton && (
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-16 right-4 rounded-full p-2 h-8 w-8"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
      
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a medical question..."
            className="min-h-10 resize-none"
            maxRows={5}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </div>
  );
}

// Simulation function - this would be replaced with actual API calls
function simulateResponse(input: string, subjectId?: string) {
  const responses = [
    "Based on the symptoms you've described, this could be related to cardiovascular pathophysiology. The key indicators are the chest pain radiating to the left arm and shortness of breath.",
    
    "When diagnosing this condition, remember the classic triad of symptoms: fever, jaundice, and right upper quadrant abdominal pain. This is highly suggestive of ascending cholangitis.",
    
    "For this type of question, focus on the pharmacokinetics. Beta-blockers work by competitively blocking beta-adrenergic receptors, reducing heart rate and blood pressure.",
    
    "This is a common question pattern in medical licensing exams. Look for the most specific diagnostic finding rather than the most common one. In this case, the elevated troponin levels with ST-segment elevation is pathognomonic.",
    
    "From an anatomical perspective, remember that the recurrent laryngeal nerve loops around the subclavian artery on the right and the aortic arch on the left before ascending in the tracheoesophageal groove.",
  ];
  
  // Simple "intelligence" to try to match the response to the question
  if (input.toLowerCase().includes("heart") || input.toLowerCase().includes("cardiac")) {
    return responses[0];
  } else if (input.toLowerCase().includes("diagnos") || input.toLowerCase().includes("symptom")) {
    return responses[1];
  } else if (input.toLowerCase().includes("drug") || input.toLowerCase().includes("medication")) {
    return responses[2];
  } else if (input.toLowerCase().includes("exam") || input.toLowerCase().includes("test")) {
    return responses[3];
  } else if (input.toLowerCase().includes("anatomy") || input.toLowerCase().includes("structure")) {
    return responses[4];
  }
  
  // Default response
  return responses[Math.floor(Math.random() * responses.length)];
}
