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

// Your actual photos from public and memories folders
const PLACEHOLDER_IMAGES = [
  // From public folder
  "/10E7404C-F5AB-46D0-BA5F-08CB55A76476_1_105_c.jpeg",
  "/17E14704-47B0-4053-BEA7-39C5ED8CA06F_1_105_c.jpeg",
  "/1A4D7476-E890-44CF-80DA-55CE1499350B_1_105_c.jpeg",
  "/85D5212E-8A69-411E-97A8-4F8912F6E834_1_105_c.jpeg",
  "/940DDE17-DF81-4F1C-85B5-E7A6760B61EC_1_105_c.jpeg",
  "/E5A594E5-EBCD-426C-806F-02DF107226FC_1_105_c.jpeg",
  "/F656920B-3710-47AC-882E-BB42C321FFB3_1_105_c.jpeg",
  "/first-hello.jpeg",
  // From memories folder
  "/memories/6bd5d6d1-d350-4b56-abc7-32532d94ba10.JPG",
  "/memories/IMG_3819.jpg",
  "/memories/IMG_4384.PNG",
  "/memories/IMG_4387.PNG",
  "/memories/IMG_4389.PNG",
  "/memories/IMG_4391.PNG",
  "/memories/IMG_4826.jpg",
  "/memories/IMG_5562.jpg",
  "/memories/dbd8cb1c-9a17-435b-8ef0-d460d5b3d6df.JPG",
  "/memories/temp_image_69296C31-DB69-45A0-97D7-76E1F2C7B526.JPEG",
];

const LOVE_MESSAGES = [
  "I LOVE YOU! 💕",
  "YOU'RE MINE! 💝",
  "FOREVER! 💗",
  "MY BABY! 🥰",
  "LOCKED IN! 🔐",
  "NO ESCAPE! 😘",
];

interface LoveVirusEffectProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function LoveVirusEffect({ isActive, onComplete }: LoveVirusEffectProps) {
  const [pictures, setPictures] = useState<FlyingPicture[]>([]);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [messages, setMessages] = useState<FloatingMessage[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

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
        src: PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
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
  }, [isActive]);

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
          {LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)]}
        </div>
      ))}

      {/* Final Message */}
      {showFinalMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-[250]">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl text-center max-w-md mx-4 animate-bounce-in">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl md:text-3xl font-bold text-rose-600 mb-2 font-dancing">
              You can&apos;t escape my love!
            </h2>
            <p className="text-zinc-500 text-sm mb-4">
              At this point you don&apos;t even have an option, we locked in 😂😂
            </p>
            <p className="text-zinc-600 mb-6">
              Every moment with you is a treasure. Please be my Valentine? 🥺
            </p>
            <button
              onClick={onComplete}
              className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 transition-colors shadow-lg shadow-rose-300"
            >
              Fine, YES! I love you too! ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
