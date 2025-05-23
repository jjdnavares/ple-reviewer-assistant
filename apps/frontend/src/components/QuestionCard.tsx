"use client";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const question = {
  text: "A 65-year-old man presents with chest pain. What is the most likely diagnosis?",
  choices: [
    "Stable angina",
    "Unstable angina",
    "Myocardial infarction",
    "Pericarditis",
  ],
  answer: 2,
  explanation: "Classic presentation for myocardial infarction (MI). Acute, severe chest pain, often radiating, in a man with risk factors.",
};

export default function QuestionCard() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  function handleSelect(i: number) {
    setSelected(i);
    setTimeout(() => setShowResult(true), 400); // allow animation
  }

  return (
    <motion.div
      className="relative bg-white/60 dark:bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-2xl w-full flex flex-col gap-8 border border-primary/30 ring-1 ring-blue-200/50"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70 }}
      aria-label="Question Card"
    >
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 w-full h-2 rounded-t-3xl overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary/80 via-sky-400/40 to-primary/80 animate-pulse" style={{ width: '60%' }} />
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <div className="text-2xl font-bold text-primary tracking-tight mb-1">Question</div>
        <div className="text-lg md:text-xl text-text/90 mb-2 leading-relaxed">{question.text}</div>
      </div>
      {/* Choices */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        {question.choices.map((choice, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: selected === null ? 1.03 : 1 }}
            whileTap={{ scale: 0.98 }}
            disabled={showResult}
            aria-pressed={selected === i}
            aria-label={`Answer choice: ${choice}`}
            className={`transition-all flex-1 rounded-xl px-5 py-3 border text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30
              ${selected === i
                ? (i === question.answer
                  ? "bg-success/20 border-success text-success animate-pulse"
                  : "bg-error/10 border-error text-error animate-shake")
                : "border-primary/20 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-0.5"}
              ${showResult ? "opacity-80" : ""}
            `}
            onClick={() => handleSelect(i)}
          >
            <span className="flex items-center justify-between w-full">
              <span>{choice}</span>
              {showResult && selected === i && (
                i === question.answer ? (
                  <CheckCircle2 className="ml-3 text-success animate-pulse" />
                ) : (
                  <XCircle className="ml-3 text-error animate-shake" />
                )
              )}
            </span>
          </motion.button>
        ))}
      </div>
      {/* Feedback */}
      {showResult && (
        <motion.div
          className={`mt-6 p-5 rounded-xl shadow-inner ${selected === question.answer ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-lg font-semibold">
            {selected === question.answer ? (
              <CheckCircle2 className="text-success animate-pulse" />
            ) : (
              <XCircle className="text-error animate-shake" />
            )}
            {selected === question.answer ? "Correct!" : "Tricky question! Let's break this down together..."}
          </div>
          <div className="mt-2 text-text/80 text-base leading-relaxed">{question.explanation}</div>
        </motion.div>
      )}
      {/* Bottom bar */}
      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-2 rounded-lg bg-primary text-background font-bold shadow disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-primary/90"
          disabled={!showResult}
          tabIndex={showResult ? 0 : -1}
          aria-disabled={!showResult}
        >
          Next Question
        </button>
      </div>
    </motion.div>
  );
}
