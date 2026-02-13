"use client";

import CounterCard from "./CounterCard";
import MusicCard from "./MusicCard";
import ReasonCard from "./ReasonCard";
import ValentineCard from "./ValentineCard";

interface BentoGridProps {
  startDate: Date;
  onAcceptValentine: () => void;
  onRejectValentine: () => void;
}

export default function BentoGrid({
  startDate,
  onAcceptValentine,
  onRejectValentine,
}: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-32">
      <CounterCard startDate={startDate} />
      <MusicCard />
      <ReasonCard />
      <ValentineCard onAccept={onAcceptValentine} onReject={onRejectValentine} />
    </div>
  );
}
