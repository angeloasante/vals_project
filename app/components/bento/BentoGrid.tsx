"use client";

import CounterCard from "./CounterCard";
import MusicCard, { MusicSettingsData } from "./MusicCard";
import ReasonCard, { ReasonItemData, ReasonCardSettings } from "./ReasonCard";
import ValentineCard, { ValentineCardSettings } from "./ValentineCard";

interface BentoGridProps {
  startDate: Date;
  onAcceptValentine: () => void;
  onRejectValentine: () => void;
  reasons?: ReasonItemData[];
  musicSettings?: MusicSettingsData;
  reasonCardSettings?: ReasonCardSettings;
  valentineCardSettings?: ValentineCardSettings;
}

export default function BentoGrid({
  startDate,
  onAcceptValentine,
  onRejectValentine,
  reasons,
  musicSettings,
  reasonCardSettings,
  valentineCardSettings,
}: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-32">
      <CounterCard startDate={startDate} />
      <MusicCard settings={musicSettings} />
      <ReasonCard reasons={reasons} settings={reasonCardSettings} />
      <ValentineCard onAccept={onAcceptValentine} onReject={onRejectValentine} settings={valentineCardSettings} />
    </div>
  );
}
