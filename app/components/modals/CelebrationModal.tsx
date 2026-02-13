"use client";

import Icon from "../ui/Icon";

export interface CelebrationModalSettings {
  title?: string;
  message?: string;
  buttonText?: string;
}

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: CelebrationModalSettings;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  settings,
}: CelebrationModalProps) {
  if (!isOpen) return null;

  const title = settings?.title || "Yay! ❤️";
  const message = settings?.message || "You just made me the happiest person alive. I love you so much!";
  const buttonText = settings?.buttonText || "Can't wait!";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center transition-opacity duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm mx-4 transform scale-100 transition-transform duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white -z-10" />
        <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Icon name="solar:confetti-minimalistic-bold" width={40} />
        </div>
        <h2 className="text-3xl font-playfair font-bold text-rose-950 mb-3">
          {title}
        </h2>
        <p className="text-rose-800/70 mb-8 leading-relaxed">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-rose-600 text-white py-4 rounded-2xl font-medium hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
