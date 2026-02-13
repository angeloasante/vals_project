"use client";

import Icon from "./ui/Icon";

interface HeroProps {
  heroTitle?: string;
  heroSubtitle?: string;
  recipientName?: string;
}

export default function Hero({ 
  heroTitle = "You are my forever.",
  heroSubtitle = "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  recipientName = "My Love"
}: HeroProps) {
  // Split heroTitle if it contains "forever" to style it differently
  const formatTitle = () => {
    if (heroTitle.toLowerCase().includes("forever")) {
      const parts = heroTitle.split(/forever/i);
      return (
        <>
          {parts[0]}
          <span className="not-italic font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200">
            forever.
          </span>
          {parts[1]}
        </>
      );
    }
    return heroTitle;
  };

  return (
    <div className="text-center mb-24 fade-in-up">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-rose-50 text-xs font-medium mb-8 hover:bg-white/20 transition-all cursor-default">
        <Icon name="solar:heart-shine-linear" className="animate-pulse" />
        <span>Made with love for {recipientName}</span>
      </div>

      <h1 className="text-6xl md:text-8xl font-playfair italic font-medium tracking-tight mb-8 leading-[1] text-white drop-shadow-2xl">
        {formatTitle()}
      </h1>

      <p className="text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed text-rose-100/90 font-dancing">
        &quot;{heroSubtitle}&quot;
      </p>
    </div>
  );
}
