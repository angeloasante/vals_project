"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Icon from "./ui/Icon";
import { useScrollReveal } from "../hooks/useScrollReveal";

export interface GalleryItem {
  id: string;
  src: string;
  type?: string;
  caption?: string;
}

// Default gallery items for demo
const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    src: "/memories/6bd5d6d1-d350-4b56-abc7-32532d94ba10.JPG",
    type: "image",
    caption: "You're everything to me 💕",
  },
  {
    id: "2",
    src: "/memories/IMG_3819.jpg",
    type: "image",
    caption: "My favorite view 😍",
  },
  {
    id: "3",
    src: "/memories/IMG_4384.PNG",
    type: "image",
    caption: "Beautiful inside and out 💝",
  },
  {
    id: "4",
    src: "/memories/IMG_4387.PNG",
    type: "image",
    caption: "That face I love so much 🥰",
  },
  {
    id: "5",
    src: "/memories/IMG_4389.PNG",
    type: "image",
    caption: "Always stunning ✨",
  },
  {
    id: "6",
    src: "/memories/IMG_4391.PNG",
    type: "image",
    caption: "My whole heart 💖",
  },
  {
    id: "7",
    src: "/memories/IMG_4826.jpg",
    type: "image",
    caption: "So beautiful 😍",
  },
  {
    id: "8",
    src: "/memories/IMG_5562.jpg",
    type: "image",
    caption: "My cute zombie 🧟‍♀️💕",
  },
  {
    id: "9",
    src: "/memories/dbd8cb1c-9a17-435b-8ef0-d460d5b3d6df.JPG",
    type: "image",
    caption: "The one who has my heart 👑",
  },
  {
    id: "10",
    src: "/memories/temp_image_69296C31-DB69-45A0-97D7-76E1F2C7B526.JPEG",
    type: "image",
    caption: "Forever yours 💕",
  },
  {
    id: "11",
    src: "/memories/6733322b35f94933b83cf9e9aa593551.MOV",
    type: "video",
    caption: "My cute dancer that dances like a chicken 🐔💃",
  },
  {
    id: "12",
    src: "/memories/d66e3fa0f9ca4d199acfc97123410b43.MOV",
    type: "video",
    caption: "My fav yapper 🗣️😂",
  },
  {
    id: "13",
    src: "/memories/ec3d6df9b597427d941a8cf3bd57403f.MOV",
    type: "video",
    caption: "My lawyer ⚖️👩‍⚖️",
  },
];

interface GalleryProps {
  items?: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  // Use provided items or default to demo items
  const galleryItems = items && items.length > 0 ? items : DEFAULT_GALLERY_ITEMS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startX = useRef(0);
  const headerRef = useScrollReveal();

  // Sync muted state with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, currentIndex]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      // Try to play with sound after user interaction
      if (!newMuted) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX.current;
    setDragOffset(diff);
    setRotation(diff * 0.05);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        swipeRight();
      } else {
        swipeLeft();
      }
    } else {
      setDragOffset(0);
      setRotation(0);
    }
  };

  const swipeLeft = () => {
    setDirection("left");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
      setDirection(null);
      setDragOffset(0);
      setRotation(0);
    }, 300);
  };

  const swipeRight = () => {
    setDirection("right");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
      setDirection(null);
      setDragOffset(0);
      setRotation(0);
    }, 300);
  };

  const currentItem = galleryItems[currentIndex];
  const nextItem = galleryItems[(currentIndex + 1) % galleryItems.length];
  const nextNextItem = galleryItems[(currentIndex + 2) % galleryItems.length];

  // Determine swipe indicator opacity
  const likeOpacity = Math.min(Math.max(dragOffset / 100, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragOffset / 100, 0), 1);

  return (
    <div id="gallery" className="mb-32">
      <div ref={headerRef} className="text-center mb-12 reveal-on-scroll">
        <h2 className="text-4xl font-playfair text-white mb-2">Our Moments</h2>
        <p className="text-rose-200/60 text-sm tracking-wide uppercase">
          Swipe through our memories
        </p>
      </div>

      <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
        {/* Card Stack */}
        <div className="relative w-[300px] md:w-[350px] h-[420px] md:h-[500px]">
          {/* Background cards (stack effect) */}
          <div
            className="absolute inset-0 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/10 transform scale-[0.9] translate-y-4 -rotate-3 overflow-hidden"
          >
            {nextNextItem.type === "video" ? (
              <video src={nextNextItem.src} className="w-full h-full object-cover" muted preload="none" />
            ) : (
              <Image 
                src={nextNextItem.src} 
                alt="" 
                fill 
                className="object-cover" 
                sizes="350px"
                quality={60}
                unoptimized
              />
            )}
          </div>
          <div
            className="absolute inset-0 rounded-3xl bg-white/30 backdrop-blur-sm border border-white/20 transform scale-[0.95] translate-y-2 rotate-2 overflow-hidden"
          >
            {nextItem.type === "video" ? (
              <video src={nextItem.src} className="w-full h-full object-cover" muted preload="none" />
            ) : (
              <Image 
                src={nextItem.src} 
                alt="" 
                fill 
                className="object-cover" 
                sizes="350px"
                quality={60}
                unoptimized
              />
            )}
          </div>

          {/* Main Card */}
          <div
            ref={cardRef}
            className={`absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing transition-transform ${
              direction ? "duration-300" : isDragging ? "duration-0" : "duration-200"
            }`}
            style={{
              transform: `translateX(${
                direction === "left"
                  ? "-150%"
                  : direction === "right"
                  ? "150%"
                  : dragOffset
              }px) rotate(${
                direction === "left"
                  ? "-30deg"
                  : direction === "right"
                  ? "30deg"
                  : rotation
              }deg)`,
              opacity: direction ? 0 : 1,
            }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {/* Photo or Video */}
            {currentItem.type === "video" ? (
              <video
                key={currentItem.id}
                ref={videoRef}
                src={currentItem.src}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                style={{ pointerEvents: "none" }}
              />
            ) : (
              <Image
                src={currentItem.src}
                alt={currentItem.caption || ""}
                fill
                className="object-cover pointer-events-none"
                draggable={false}
                sizes="300px"
                priority={currentIndex === 0}
                quality={75}
                unoptimized
              />
            )}

            {/* Video indicator + Mute button */}
            {currentItem.type === "video" && (
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
                <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-2 text-white text-sm">
                  <Icon name="solar:videocamera-record-bold" width={16} />
                  Video
                </div>
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors active:scale-95"
                >
                  <Icon 
                    name={isMuted ? "solar:volume-cross-bold" : "solar:volume-loud-bold"} 
                    width={24} 
                  />
                </button>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Like/Nope Indicators */}
            <div
              className="absolute top-8 left-8 px-4 py-2 border-4 border-green-500 text-green-500 font-bold text-2xl rounded-lg rotate-[-20deg] uppercase"
              style={{ opacity: likeOpacity }}
            >
              Love! 💚
            </div>
            <div
              className="absolute top-8 right-8 px-4 py-2 border-4 border-rose-500 text-rose-500 font-bold text-2xl rounded-lg rotate-[20deg] uppercase"
              style={{ opacity: nopeOpacity }}
            >
              More! 💕
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-lg font-medium leading-snug">
                {currentItem.caption}
              </p>
            </div>
          </div>

          {/* Swipe Buttons */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6">
            <button
              onClick={swipeLeft}
              aria-label="Previous photo"
              className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-500 hover:scale-110 transition-transform active:scale-95"
            >
              <Icon name="solar:arrow-left-bold" width={24} />
            </button>
            <button
              onClick={swipeRight}
              aria-label="Love this photo"
              className="w-16 h-16 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
            >
              <Icon name="solar:heart-bold" width={28} />
            </button>
            <button
              onClick={swipeRight}
              aria-label="Next photo"
              className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-green-500 hover:scale-110 transition-transform active:scale-95"
            >
              <Icon name="solar:arrow-right-bold" width={24} />
            </button>
          </div>
        </div>

        {/* Photo Counter */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {galleryItems.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-24 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-3 justify-center min-w-max px-4">
          {galleryItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`View ${item.type === "video" ? "video" : "photo"} ${idx + 1}: ${item.caption}`}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                idx === currentIndex
                  ? "ring-2 ring-white ring-offset-2 ring-offset-rose-700 scale-110"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {item.type === "video" ? (
                <>
                  <video src={item.src} className="w-full h-full object-cover" muted preload="none" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Icon name="solar:play-bold" width={20} className="text-white" />
                  </div>
                </>
              ) : (
                <Image 
                  src={item.src} 
                  alt="" 
                  fill 
                  className="object-cover" 
                  sizes="80px"
                  quality={50}
                  unoptimized
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
