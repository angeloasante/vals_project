"use client";

import Icon from "../ui/Icon";

export interface RejectionModalSettings {
  title?: string;
  message?: string;
  acceptButton?: string;
  rejectButton?: string;
}

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onStillNo: () => void;
  settings?: RejectionModalSettings;
}

export default function RejectionModal({
  isOpen,
  onClose,
  onAccept,
  onStillNo,
  settings,
}: RejectionModalProps) {
  if (!isOpen) return null;

  const title = settings?.title || "Are you sure?";
  const message = settings?.message || "My heart might break into a million pieces...";
  const acceptButton = settings?.acceptButton || "Yes, I'll be yours";
  const rejectButton = settings?.rejectButton || "Still No";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center transition-opacity duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 transform scale-100 transition-transform duration-300 relative">
        <div className="w-16 h-16 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="solar:sad-circle-bold" width={32} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">{title}</h2>
        <p className="text-zinc-500 mb-6 text-sm">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              onClose();
              onAccept();
            }}
            className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700"
          >
            {acceptButton}
          </button>
          <button
            onClick={onStillNo}
            className="flex-1 bg-zinc-100 text-zinc-600 py-3 rounded-xl font-medium hover:bg-zinc-200"
          >
            {rejectButton}
          </button>
        </div>
      </div>
    </div>
  );
}
