"use client";

import { useEffect, useState } from "react";

interface FlyingPicture {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
  src: string;
}

interface FloatingMessage {
  id: number;
  startX: number;
  y: number;
  speed: number;
  size: number;
}

// Default images (fallback if no custom images provided)
const DEFAULT_IMAGES = [
  "/placeholder-heart.png",
];

const DEFAULT_MESSAGES = [
  "I LOVE YOU! 💕",
  "YOU'RE MINE! 💝",
  "FOREVER! 💗",
  "MY BABY! 🥰",
  "LOCKED IN! 🔐",
  "NO ESCAPE! 😘",
];

export interface LoveVirusSettings {
  images?: string[];
  messages?: string[];
  finalTitle?: string;
  finalMessage?: string;
  finalSubmessage?: string;
  finalButton?: string;
}

interface LoveVirusEffectProps {
  isActive: boolean;
  onComplete: () => void;
  settings?: LoveVirusSettings;
  galleryImages?: string[]; // Fallback to gallery images if no custom images
}

export default function LoveVirusEffect({ isActive, onComplete, settings, galleryImages }: LoveVirusEffectProps) {
  const [pictures, setPictures] = useState<FlyingPicture[]>([]);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [messages, setMessages] = useState<FloatingMessage[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Use custom images, or fall back to gallery images, or use defaults
  const imagesToUse = (settings?.images && settings.images.length > 0) 
    ? settings.images 
    : (galleryImages && galleryImages.length > 0)
      ? galleryImages
      : DEFAULT_IMAGES;
  
  const messagesToUse = (settings?.messages && settings.messages.length > 0) 
    ? settings.messages 
    : DEFAULT_MESSAGES;

  const finalTitle = settings?.finalTitle || "You can't escape my love!";
  const finalMessage = settings?.finalMessage || "At this point you don't even have an option, we locked in 😂😂";
  const finalSubmessage = settings?.finalSubmessage || "Every moment with you is a treasure. Please be my Valentine? 🥺";
  const finalButton = settings?.finalButton || "Fine, YES! I love you too! ❤️";

  useEffect(() => {
    if (!isActive) {
      setPictures([]);
      setHearts([]);
      setMessages([]);
      setShowFinalMessage(false);
      return;
    }

    // Generate flying pictures
    const newPictures: FlyingPicture[] = [];
    for (let i = 0; i < 50; i++) {
      newPictures.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360 - 180,
        scale: 0.5 + Math.random() * 0.8,
        delay: Math.random() * 2000,
        src: imagesToUse[Math.floor(Math.random() * imagesToUse.length)],
      });
    }
    setPictures(newPictures);

    // Generate floating hearts
    const heartInterval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-30),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: 100 + Math.random() * 20,
        },
      ]);
    }, 100);

    // Generate floating messages that move across screen
    const messageInterval = setInterval(() => {
      setMessages((prev) => [
        ...prev.slice(-15),
        {
          id: Date.now(),
          startX: -20,
          y: 5 + Math.random() * 85,
          speed: 8 + Math.random() * 12,
          size: 14 + Math.random() * 10,
        },
      ]);
    }, 300);

    // Show final message after pictures settle
    const messageTimeout = setTimeout(() => {
      setShowFinalMessage(true);
    }, 3000);

    return () => {
      clearInterval(heartInterval);
      clearInterval(messageInterval);
      clearTimeout(messageTimeout);
    };
  }, [isActive, imagesToUse]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-rose-950/90 backdrop-blur-sm">
      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-rose-500 animate-float-up pointer-events-none"
          style={{
            left: `${heart.x}%`,
            bottom: `${heart.y}%`,
            fontSize: `${20 + Math.random() * 30}px`,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Flying Pictures - Echo Effect */}
      {pictures.map((pic) => (
        <div
          key={pic.id}
          className="absolute rounded-xl overflow-hidden shadow-2xl border-4 border-white animate-echo-in pointer-events-none"
          style={{
            left: `${pic.x}%`,
            top: `${pic.y}%`,
            transform: `rotate(${pic.rotation}deg) scale(${pic.scale})`,
            animationDelay: `${pic.delay}ms`,
            width: "120px",
            height: "120px",
          }}
        >
          <img
            src={pic.src}
            alt="Memory"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* I Love You Messages smoothly floating across */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="absolute bg-white text-rose-600 px-4 py-2 rounded-full font-bold shadow-xl pointer-events-none whitespace-nowrap animate-slide-across"
          style={{
            top: `${msg.y}%`,
            fontSize: `${msg.size}px`,
            animationDuration: `${msg.speed}s`,
          }}
        >
          {messagesToUse[Math.floor(Math.random() * messagesToUse.length)]}
        </div>
      ))}

      {/* Final Message */}
      {showFinalMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-[250]">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl text-center max-w-md mx-4 animate-bounce-in">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl md:text-3xl font-bold text-rose-600 mb-2 font-dancing">
              {finalTitle}
            </h2>
            <p className="text-zinc-500 text-sm mb-4">
              {finalMessage}
            </p>
            <p className="text-zinc-600 mb-6">
              {finalSubmessage}
            </p>
            <button
              onClick={onComplete}
              className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 transition-colors shadow-lg shadow-rose-300"
            >
              {finalButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
