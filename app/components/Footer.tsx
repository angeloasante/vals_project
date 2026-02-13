"use client";

import Icon from "./ui/Icon";

interface FooterProps {
  senderName?: string;
  recipientName?: string;
}

export default function Footer({ senderName = "Me", recipientName = "You" }: FooterProps) {
  return (
    <footer className="w-full py-12 text-center relative z-10 bg-gradient-to-t from-rose-950/50 to-transparent">
      <p className="font-dancing text-2xl text-rose-200/80 mb-2">
        Forever &amp; Always
      </p>
      <div className="flex justify-center items-center gap-2 text-rose-300/50 text-xs uppercase tracking-widest">
        <span>{recipientName}</span>
        <Icon name="solar:heart-bold" className="text-rose-500" />
        <span>{senderName}</span>
      </div>
    </footer>
  );
}
