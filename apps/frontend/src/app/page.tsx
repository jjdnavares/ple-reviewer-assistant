"use client";
import dynamic from "next/dynamic";
import QuestionCard from "@/components/QuestionCard";
import ProgressIVDrip from "@/components/ProgressIVDrip";
import AISidebar from "@/components/AISidebar";
import StatusToast from "@/components/StatusToast";
import { useState } from "react";

const DynamicAISidebar = dynamic(() => import("@/components/AISidebar"), { ssr: false });

export default function Home() {
  const [progress, setProgress] = useState(47); // demo value
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Demo: show a toast after answering a question (simulate)
  // In production, trigger setToast on events

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center pt-10 pb-20 px-2 md:px-0">
      {/* Progress IV Drip - fixed left */}
      <div className="fixed left-0 top-0 h-full w-28 z-30 hidden md:flex flex-col items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <ProgressIVDrip value={progress} />
          <div className="text-xs text-text/60 mt-2 text-center">Study streak:<br/><span className="font-bold text-success">7 days 💪</span></div>
        </div>
      </div>
      {/* AI Assistant Sidebar - fixed right */}
      <div className="fixed right-0 top-0 h-full z-40 hidden md:block">
        <DynamicAISidebar />
      </div>
      {/* Main Content - always centered */}
      <main className="flex flex-1 flex-col items-center justify-center w-full min-h-[60vh] md:mx-auto md:max-w-2xl md:px-0 px-2" style={{ marginLeft: '7rem', marginRight: '22rem' }}>
        <QuestionCard />
        <button
          className="mt-8 px-5 py-3 rounded-lg bg-primary text-background font-semibold shadow hover:bg-primary/90 transition"
          onClick={() => setToast({ type: "success", message: `You've reviewed ${progress} questions today. Your brain deserves a break! 🧠` })}
        >
          Show Motivation
        </button>
        {/* On mobile, show progress below main content */}
        <div className="flex flex-col items-center gap-6 md:hidden mt-8">
          <ProgressIVDrip value={progress} />
          <div className="text-xs text-text/60 mt-2">Study streak: <span className="font-bold text-success">7 days 💪</span></div>
        </div>
      </main>
      {/* Toast notification */}
      {toast && (
        <StatusToast type={toast.type} message={toast.message} />
      )}
    </div>
  );
}
