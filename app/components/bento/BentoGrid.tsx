"use client";

import CounterCard from "./CounterCard";
import MusicCard, { MusicSettingsData } from "./MusicCard";
import ReasonCard, { ReasonItemData } from "./ReasonCard";
import ValentineCard from "./ValentineCard";

interface BentoGridProps {
  startDate: Date;
  onAcceptValentine: () => void;
  onRejectValentine: () => void;
  reasons?: ReasonItemData[];
  musicSettings?: MusicSettingsData;
}

export default function BentoGrid({
  startDate,
  onAcceptValentine,
  onRejectValentine,
  reasons,
  musicSettings,
}: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-32">
      <CounterCard startDate={startDate} />
      <MusicCard settings={musicSettings} />
      <ReasonCard reasons={reasons} />
      <ValentineCard onAccept={onAcceptValentine} onReject={onRejectValentine} />
    </div>
  );
}
