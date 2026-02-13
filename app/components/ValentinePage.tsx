"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";
import Hero from "./Hero";
import BentoGrid from "./bento/BentoGrid";
import Timeline, { TimelineItemData } from "./Timeline";
import OpenWhenNotes, { OpenWhenNoteData } from "./OpenWhenNotes";
import BucketList, { BucketListItemData } from "./BucketList";
import LoveCoupons, { CouponItemData } from "./LoveCoupons";
import Gallery, { GalleryItem } from "./Gallery";
import LoveBook from "./LoveBook";
import CelebrationModal from "./modals/CelebrationModal";
import NoteModal from "./modals/NoteModal";
import RejectionModal from "./modals/RejectionModal";
import SecondRejectionModal from "./modals/SecondRejectionModal";
import LoveVirusEffect from "./LoveVirusEffect";
import { createConfetti } from "../utils/effects";
import { ReasonItemData } from "./bento/ReasonCard";
import { MusicSettingsData } from "./bento/MusicCard";

interface ValentinePageProps {
  startDate: Date;
  recipientName?: string;
  senderName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  galleryItems?: GalleryItem[];
  timelineItems?: TimelineItemData[];
  reasons?: ReasonItemData[];
  bucketList?: BucketListItemData[];
  openWhenNotes?: OpenWhenNoteData[];
  musicSettings?: MusicSettingsData;
  coupons?: CouponItemData[];
  showBucketList?: boolean;
  showOpenWhen?: boolean;
  showCoupons?: boolean;
}

export default function ValentinePage({ 
  startDate,
  recipientName = "My Love",
  senderName = "Your Valentine",
  heroTitle = "You are my forever.",
  heroSubtitle = "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  galleryItems,
  timelineItems,
  reasons,
  bucketList,
  openWhenNotes,
  musicSettings,
  coupons,
  showBucketList = true,
  showOpenWhen = true,
  showCoupons = true,
}: ValentinePageProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const [showSecondRejection, setShowSecondRejection] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [currentNote, setCurrentNote] = useState<OpenWhenNoteData | null>(null);
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

  const handleOpenNote = (note: OpenWhenNoteData) => {
    setCurrentNote(note);
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
          reasons={reasons}
          musicSettings={musicSettings}
        />
        <Timeline items={timelineItems} />
        {showOpenWhen && <OpenWhenNotes notes={openWhenNotes} onOpenNote={handleOpenNote} />}
        {showBucketList && <BucketList items={bucketList} />}
        {showCoupons && <LoveCoupons coupons={coupons} />}
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
        note={currentNote}
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
