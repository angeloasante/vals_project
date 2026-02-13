"use client";

import { useState, useEffect } from "react";
import Icon from "../ui/Icon";
import GlassCard from "../ui/GlassCard";

interface CounterCardProps {
  startDate: Date;
}

export default function CounterCard({ startDate }: CounterCardProps) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const today = new Date();
      const diff = today.getTime() - startDate.getTime();
      const calculatedDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const calculatedHours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      setDays(calculatedDays);
      setHours(calculatedHours);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <GlassCard className="md:col-span-4 rounded-[2rem] p-8 md:p-10 relative overflow-hidden min-h-[280px] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-500 fade-in-up delay-100">
      <div className="absolute top-0 right-0 p-40 bg-gradient-to-br from-rose-400/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20" />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2 text-rose-900/60 font-medium text-xs tracking-widest uppercase">
            <Icon name="solar:calendar-linear" />
            <span>Since We Met</span>
          </div>
          <h3 className="text-3xl font-medium text-rose-950">Loving you for</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/50 backdrop-blur border border-white/60 flex items-center justify-center text-rose-600 shadow-sm">
          <Icon name="solar:infinity-bold" width={24} />
        </div>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        <div className="bg-white/40 rounded-2xl p-3 md:p-4 backdrop-blur-sm">
          <span className="block text-2xl md:text-4xl font-bold text-rose-900 tracking-tighter">
            {days}
          </span>
          <span className="text-[10px] md:text-xs font-medium text-rose-800 uppercase tracking-wide">
            Days
          </span>
        </div>
        <div className="bg-white/40 rounded-2xl p-3 md:p-4 backdrop-blur-sm">
          <span className="block text-2xl md:text-4xl font-bold text-rose-900 tracking-tighter">
            {hours}
          </span>
          <span className="text-[10px] md:text-xs font-medium text-rose-800 uppercase tracking-wide">
            Hours
          </span>
        </div>
        <div className="bg-white/40 rounded-2xl p-3 md:p-4 backdrop-blur-sm hidden md:block">
          <span className="block text-2xl md:text-4xl font-bold text-rose-900 tracking-tighter">
            ∞
          </span>
          <span className="text-[10px] md:text-xs font-medium text-rose-800 uppercase tracking-wide">
            Love
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
