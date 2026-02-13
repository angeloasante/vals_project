"use client";

import Icon from "../ui/Icon";

interface SecondRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onFinalNo: () => void;
}

export default function SecondRejectionModal({
  isOpen,
  onClose,
  onAccept,
  onFinalNo,
}: SecondRejectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center transition-opacity duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 transform scale-100 transition-transform duration-300">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Icon name="solar:heart-broken-bold" width={32} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Last Chance!</h2>
        <p className="text-zinc-500 mb-6 text-sm">
          I&apos;ll make you the happiest person, I promise!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose();
              onAccept();
            }}
            className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700 shadow-lg shadow-rose-200"
          >
            Okay, Yes! ❤️
          </button>
          <button
            onClick={() => {
              onClose();
              onFinalNo();
            }}
            className="flex-1 bg-zinc-100 text-zinc-600 py-3 rounded-xl font-medium hover:bg-zinc-200"
          >
            No 😤
          </button>
        </div>
      </div>
    </div>
  );
}
