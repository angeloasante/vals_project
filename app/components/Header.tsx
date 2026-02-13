"use client";

import Link from "next/link";

const navLinks = [
  { href: "#memories", label: "Memories" },
  { href: "#bucketlist", label: "Dreams" },
  { href: "#coupons", label: "Gifts" },
  { href: "#gallery", label: "Gallery" },
];

interface HeaderProps {
  recipientName?: string;
}

export default function Header({ recipientName = "My Love" }: HeaderProps) {
  return (
    <nav className="w-full max-w-6xl mx-auto p-8 flex justify-between items-center z-50 mix-blend-plus-lighter">
      <div className="font-playfair italic font-bold text-2xl tracking-tight text-white flex items-center gap-2">
        For {recipientName} 💕
      </div>
      <div className="flex gap-6 text-sm font-medium text-rose-100/80">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
