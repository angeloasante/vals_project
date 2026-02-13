"use client";

import { useState } from "react";
import Icon from "../ui/Icon";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";

export interface ReasonItemData {
  id?: string;
  text: string;
}

// Default reasons for demo
const DEFAULT_REASONS: ReasonItemData[] = [
  { text: "Have you seen your ass and boobs girllllllll😂" },
  { text: "Your fat ass... i mean who am i kidding 🍑😏" },
  { text: "Your boobs 😍" },
  { text: "Your smile lights up the room" },
  { text: "The way you look at me" },
  { text: "Your kindness to strangers" },
  { text: "How you support my dreams" },
  { text: "Your silly laugh" },
  { text: "The safety I feel with you" },
  { text: "Your morning voice" },
];

interface ReasonCardProps {
  reasons?: ReasonItemData[];
}

export default function ReasonCard({ reasons }: ReasonCardProps) {
  const reasonList = reasons && reasons.length > 0 ? reasons : DEFAULT_REASONS;
  const [showResult, setShowResult] = useState(false);
  const [currentReason, setCurrentReason] = useState("");

  const generateReason = () => {
    const random = reasonList[Math.floor(Math.random() * reasonList.length)];
    setCurrentReason(random.text);
    setShowResult(true);
  };

  const resetReason = () => {
    setShowResult(false);
  };

  return (
    <GlassCard className="md:col-span-3 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center gap-6 min-h-[240px] fade-in-up delay-300 relative overflow-hidden hover:shadow-xl transition-all">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />

      {!showResult ? (
        <div className="relative z-10 transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Icon name="solar:magic-stick-3-linear" width={32} />
          </div>
          <h3 className="text-xl font-medium text-rose-950 mb-1">
            Why I Love You
          </h3>
          <p className="text-sm text-rose-800/60 mb-6">Tap to reveal a reason</p>
          <Button
            onClick={generateReason}
            variant="primary"
            className="px-6 py-3 rounded-xl text-sm"
          >
            Tell Me Why
          </Button>
        </div>
      ) : (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
          <p className="text-3xl font-dancing font-bold text-rose-600 mb-4 leading-tight">
            {currentReason}
          </p>
          <button
            onClick={resetReason}
            className="text-xs text-rose-400 hover:text-rose-600 font-medium tracking-wide uppercase mt-4 border-b border-rose-200 pb-0.5"
          >
            Another One
          </button>
        </div>
      )}
    </GlassCard>
  );
}
