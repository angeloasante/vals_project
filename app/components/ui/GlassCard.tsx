"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  dark = false,
}: GlassCardProps) {
  const baseClass = dark ? "glass-card-dark" : "glass-card";
  
  return (
    <div className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
}
