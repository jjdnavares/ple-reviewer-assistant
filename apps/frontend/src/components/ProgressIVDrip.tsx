"use client";
import { motion } from "framer-motion";

interface ProgressIVDripProps {
  value: number; // 0-100
}

export default function ProgressIVDrip({ value }: ProgressIVDripProps) {
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="text-xs text-text/60 mb-1">Progress</div>
      <div className="relative h-32 w-7 flex flex-col items-center">
        {/* IV drip outline */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-7 rounded-b-2xl border-2 border-primary bg-background" />
        {/* Fluid fill animation */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 rounded-b-2xl bg-primary"
          style={{ originY: 1 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: value / 100 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div style={{ height: "128px" }} />
        </motion.div>
        {/* Drip */}
        <motion.div
          className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-lg"
          animate={{ y: [0, 10, 0], opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </div>
      <div className="text-xs mt-1 text-primary font-bold">{value}%</div>
    </div>
  );
}
