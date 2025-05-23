"use client";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export type ToastType = "success" | "error";

export default function StatusToast({
  type = "success",
  message,
}: {
  type: ToastType;
  message: string;
}) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      className={`fixed bottom-8 right-8 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-base font-semibold transition-colors
        ${type === "success" ? "bg-success/90 text-background" : "bg-error/90 text-background"}`}
    >
      {type === "success" ? (
        <CheckCircle2 className="text-background" />
      ) : (
        <XCircle className="text-background" />
      )}
      {message}
    </motion.div>
  );
}
