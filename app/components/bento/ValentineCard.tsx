"use client";

import Icon from "../ui/Icon";
import GlassCard from "../ui/GlassCard";

export interface ValentineCardSettings {
  label?: string;
  question?: string;
  yesText?: string;
  noText?: string;
}

interface ValentineCardProps {
  onAccept: () => void;
  onReject: () => void;
  settings?: ValentineCardSettings;
}

export default function ValentineCard({ onAccept, onReject, settings }: ValentineCardProps) {
  const label = settings?.label || "Important";
  const question = settings?.question || "Will you be my Valentine?";
  const yesText = settings?.yesText || "Yes, Always";
  const noText = settings?.noText || "No";

  // Split question into lines if it contains newline
  const questionLines = question.split('\n');

  return (
    <GlassCard className="md:col-span-3 bg-gradient-to-br from-rose-50 to-white rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden fade-in-up delay-200">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold tracking-widest uppercase">
            {label}
          </span>
          <h3 className="text-2xl font-playfair font-semibold text-rose-950 leading-tight">
            {questionLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < questionLines.length - 1 && <br />}
              </span>
            ))}
          </h3>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onAccept}
              className="px-6 py-2.5 rounded-full bg-rose-900 text-white text-sm font-medium hover:bg-black transition-colors shadow-lg flex items-center gap-2 group"
            >
              <span>{yesText}</span>
              <Icon
                name="solar:heart-bold"
                className="group-hover:text-rose-400 transition-colors"
              />
            </button>
            <button
              onClick={onReject}
              className="px-6 py-2.5 rounded-full bg-white border border-rose-100 text-rose-900 text-sm font-medium hover:bg-rose-50 transition-colors"
            >
              {noText}
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <Icon name="solar:cupid-linear" className="text-rose-200" width={80} />
        </div>
      </div>
    </GlassCard>
  );
}
