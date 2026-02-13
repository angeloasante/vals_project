"use client";

import { useState, useEffect, useRef } from "react";
import GlassCard from "../ui/GlassCard";
import Icon from "../ui/Icon";

// Default values for demo
const DEFAULT_AUDIO_SRC = "/our-song.mp3";
const DEFAULT_ALBUM_COVER = "https://i.scdn.co/image/ab67616d0000b273645e5c6c5babe534c007e2c5";
const DEFAULT_SONG_TITLE = "Our Song";
const DEFAULT_ARTIST = "For Us 💕";

// Fixed heights for sound wave bars (no Math.random() to avoid hydration mismatch)
const WAVE_HEIGHTS = [18, 22, 14, 20, 16];

export interface MusicSettingsData {
  songUrl?: string;
  songTitle?: string;
  artist?: string;
  albumCover?: string;
}

interface MusicCardProps {
  settings?: MusicSettingsData;
}

export default function MusicCard({ settings }: MusicCardProps) {
  const audioSrc = settings?.songUrl || DEFAULT_AUDIO_SRC;
  const albumCover = settings?.albumCover || DEFAULT_ALBUM_COVER;
  const songTitle = settings?.songTitle || DEFAULT_SONG_TITLE;
  const artist = settings?.artist || DEFAULT_ARTIST;

  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle autoplay after mount (client-side only)
  useEffect(() => {
    setMounted(true);
    // Small delay to let page load, then try to autoplay
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked, user needs to interact
            setIsPlaying(false);
          });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <GlassCard className="md:col-span-2 rounded-[2rem] p-4 md:p-6 flex flex-col justify-between h-[280px] fade-in-up delay-200 relative overflow-hidden group">
      {/* Audio element with preload */}
      {mounted && (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          preload="auto"
          onCanPlayThrough={() => setIsLoaded(true)}
          className="hidden"
        />
      )}

      {/* Album art background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700 blur-sm"
        style={{ backgroundImage: `url('${albumCover}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-rose-800/30 to-transparent" />

      {/* Vinyl with album art */}
      <div
        className="relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white/20 flex items-center justify-center bg-black shadow-2xl mx-auto mt-2 cursor-pointer group/vinyl hover:scale-105 transition-transform"
        onClick={togglePlay}
        style={{ animation: isPlaying ? "spin 8s linear infinite" : "none" }}
      >
        {/* Vinyl grooves */}
        <div className="absolute inset-2 rounded-full border border-white/10" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-white/10" />

        {/* Album art center */}
        <div
          className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/50 overflow-hidden"
          style={{
            backgroundImage: `url('${albumCover}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-full bg-black/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
          </div>
        </div>

        {/* Play/Pause overlay */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/vinyl:opacity-100 transition-opacity flex items-center justify-center">
          <Icon name={isPlaying ? "solar:pause-bold" : "solar:play-bold"} width={32} className="text-white" />
        </div>
      </div>

      <div className="relative z-10 text-center mt-3">
        {/* Sound wave animation - only animate when playing */}
        <div className="flex items-center justify-center gap-1 mb-2">
          {WAVE_HEIGHTS.map((height, i) => (
            <div
              key={i}
              className={`w-1 bg-rose-500 rounded-full transition-all ${isPlaying ? "animate-pulse" : ""}`}
              style={{
                height: isPlaying ? `${height}px` : "8px",
                animationDelay: `${i * 100}ms`,
                animationDuration: "0.5s",
              }}
            />
          ))}
        </div>

        <h3 className="font-bold text-rose-900 text-sm md:text-base">{songTitle}</h3>
        <p className="text-xs text-rose-800/80 font-medium">{artist}</p>

        {/* Play button */}
        <button
          onClick={togglePlay}
          className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition-colors shadow-lg"
        >
          <Icon name={isPlaying ? "solar:pause-bold" : "solar:play-bold"} width={14} />
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </GlassCard>
  );
}
