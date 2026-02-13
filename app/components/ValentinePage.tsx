"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";
import Hero from "./Hero";
import BentoGrid from "./bento/BentoGrid";
import Timeline, { TimelineItemData } from "./Timeline";
import OpenWhenNotes from "./OpenWhenNotes";
import BucketList from "./BucketList";
import LoveCoupons from "./LoveCoupons";
import Gallery, { GalleryItem } from "./Gallery";
import LoveBook from "./LoveBook";
import CelebrationModal from "./modals/CelebrationModal";
import NoteModal from "./modals/NoteModal";
import RejectionModal from "./modals/RejectionModal";
import SecondRejectionModal from "./modals/SecondRejectionModal";
import LoveVirusEffect from "./LoveVirusEffect";
import { createConfetti } from "../utils/effects";

interface ValentinePageProps {
  startDate: Date;
  recipientName?: string;
  senderName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  galleryItems?: GalleryItem[];
  timelineItems?: TimelineItemData[];
}

export default function ValentinePage({ 
  startDate,
  recipientName = "My Love",
  senderName = "Your Valentine",
  heroTitle = "You are my forever.",
  heroSubtitle = "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  galleryItems,
  timelineItems,
}: ValentinePageProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const [showSecondRejection, setShowSecondRejection] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [noteType, setNoteType] = useState<"mad" | "sad" | "miss" | null>(null);
  const [showLoveVirus, setShowLoveVirus] = useState(false);

  const handleAcceptValentine = () => {
    setShowCelebration(true);
    createConfetti();
  };

  const handleRejectValentine = () => {
    setShowRejection(true);
  };

  const handleStillNo = () => {
    setShowRejection(false);
    setShowSecondRejection(true);
  };

  const handleFinalNo = () => {
    setShowLoveVirus(true);
  };

  const handleVirusComplete = () => {
    setShowLoveVirus(false);
    handleAcceptValentine();
  };

  const handleOpenNote = (type: "mad" | "sad" | "miss") => {
    setNoteType(type);
    setShowNote(true);
  };

  return (
    <>
      <BackgroundEffects />
      <Header recipientName={recipientName} />

      <main className="w-full max-w-4xl px-6 pb-32 mt-8 md:mt-16 z-10 relative">
        <Hero heroTitle={heroTitle} heroSubtitle={heroSubtitle} recipientName={recipientName} />
        <LoveBook />
        <BentoGrid
          startDate={startDate}
          onAcceptValentine={handleAcceptValentine}
          onRejectValentine={handleRejectValentine}
        />
        <Timeline items={timelineItems} />
        <OpenWhenNotes onOpenNote={handleOpenNote} />
        <BucketList />
        <LoveCoupons />
        <Gallery items={galleryItems} />
      </main>

      <Footer senderName={senderName} recipientName={recipientName} />

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
      <NoteModal
        isOpen={showNote}
        onClose={() => setShowNote(false)}
        noteType={noteType}
      />
      <RejectionModal
        isOpen={showRejection}
        onClose={() => setShowRejection(false)}
        onAccept={handleAcceptValentine}
        onStillNo={handleStillNo}
      />
      <SecondRejectionModal
        isOpen={showSecondRejection}
        onClose={() => setShowSecondRejection(false)}
        onAccept={handleAcceptValentine}
        onFinalNo={handleFinalNo}
      />

      <LoveVirusEffect
        isActive={showLoveVirus}
        onComplete={handleVirusComplete}
      />
    </>
  );
}
