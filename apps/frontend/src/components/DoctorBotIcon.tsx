// DoctorBotIcon.tsx
// SVG avatar for the MedReview doctor AI bot

import React from "react";

export default function DoctorBotIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Doctor AI Bot Icon"
    >
      {/* Face */}
      <circle cx="32" cy="32" r="28" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2" />
      {/* Headband */}
      <rect x="16" y="22" width="32" height="10" rx="5" fill="#38BDF8" />
      {/* Eyes */}
      <ellipse cx="24.5" cy="34.5" rx="3" ry="3.5" fill="#0EA5E9" />
      <ellipse cx="39.5" cy="34.5" rx="3" ry="3.5" fill="#0EA5E9" />
      {/* Smile */}
      <path d="M25 42c2 2 10 2 12 0" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
      {/* Stethoscope */}
      <path d="M18 46c0 6 8 8 14 8s14-2 14-8" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="46" r="2" fill="#38BDF8" stroke="#0EA5E9" strokeWidth="1" />
      <circle cx="46" cy="46" r="2" fill="#38BDF8" stroke="#0EA5E9" strokeWidth="1" />
      {/* AI dot */}
      <circle cx="32" cy="18" r="2" fill="#0EA5E9" />
    </svg>
  );
}
