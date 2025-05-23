"use client";
import { motion } from "framer-motion";
import { User, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DoctorBotIcon from "@/components/DoctorBotIcon";

const demoMessages = [
  { role: "ai", content: "Hi! I'm your MedReview assistant. Ask me anything!" },
  { role: "user", content: "Explain the difference between stable and unstable angina." },
  { role: "ai", content: "Stable angina occurs with exertion and is relieved by rest. Unstable angina can occur at rest and is more dangerous. Want a quick mnemonic?" },
];

export default function AISidebar() {
  const [open, setOpen] = useState(false); // default hidden
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open]);

  return (
    <>
      {/* Floating chat bot icon button */}
      {!open && (
        <button
          className="fixed bottom-8 right-8 z-50 bg-primary/90 hover:bg-primary ring-4 ring-primary/10 rounded-full p-3 shadow-2xl transition-all flex items-center justify-center"
          style={{ boxShadow: "0 4px 24px 0 rgba(14,165,233,0.18)" }}
          aria-label="Open AI Chatbot"
          onClick={() => setOpen(true)}
        >
          <DoctorBotIcon className="w-12 h-12" />
        </button>
      )}
      {/* Chat window */}
      <motion.aside
        className={`fixed top-0 right-0 bottom-0 h-screen w-[340px] max-w-full bg-white/60 dark:bg-background/80 backdrop-blur-2xl border-l border-primary/30 shadow-2xl z-50 flex flex-col rounded-lg ring-1 ring-blue-200/30 transition-all ${open ? "block" : "hidden"}`}
        initial={{ x: 80, opacity: 0 }}
        animate={open ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 60 }}
        aria-label="AI Assistant Chatbot"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-primary/10 bg-gradient-to-r from-primary/10 to-background/0 rounded-t-lg">
          <DoctorBotIcon className="w-8 h-8" />
          <span className="font-bold text-lg text-primary tracking-tight">Doctor AI</span>
          <button
            className="ml-auto text-primary/50 hover:text-primary rounded-full p-1 transition text-2xl"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 bg-transparent scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
          {demoMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end ${msg.role === "ai" ? "justify-start" : "justify-end"}`}
              aria-live="polite"
            >
              {msg.role === "ai" && (
                <div className="flex-shrink-0 mr-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/90 text-background shadow-lg border-2 border-background">
                    <DoctorBotIcon className="w-7 h-7" />
                  </span>
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl shadow-md max-w-[70%] text-base leading-relaxed font-medium ${msg.role === "ai" ? "bg-primary/10 text-primary rounded-bl-none" : "bg-success/20 text-success rounded-br-none"}`}
                tabIndex={0}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 ml-2">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-success/90 text-background shadow-lg border-2 border-background">
                    <User className="w-5 h-5" />
                  </span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input area */}
        <div className="relative p-4 border-t border-primary/10 bg-white/40 dark:bg-background/70 rounded-bl-3xl">
          <input
            className="w-full rounded-full border border-primary/20 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/60 placeholder:text-primary/40 transition"
            placeholder="Type your question... (coming soon)"
            disabled
          />
          <button
            className="absolute right-7 top-1/2 -translate-y-1/2 bg-primary text-background rounded-full p-2 shadow-lg disabled:opacity-50"
            disabled
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.aside>
      )
      {/* Floating open button when closed */}
      {!open && (
        <button
          className="fixed bottom-8 right-8 z-50 bg-primary/90 hover:bg-primary ring-4 ring-primary/10 rounded-full p-3 shadow-2xl transition-all flex items-center justify-center"
          style={{ boxShadow: "0 4px 24px 0 rgba(14,165,233,0.18)" }}
          aria-label="Open AI Chatbot"
          onClick={() => setOpen(true)}
        >
          <DoctorBotIcon className="w-12 h-12" />
        </button>
      )}
    </>
  );
}
