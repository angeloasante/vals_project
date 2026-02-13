"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles = "font-medium transition-colors";
  
  const variants = {
    primary:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-300/30 active:scale-95",
    secondary:
      "bg-rose-900 text-white hover:bg-black shadow-lg",
    outline:
      "bg-white border border-rose-100 text-rose-900 hover:bg-rose-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
