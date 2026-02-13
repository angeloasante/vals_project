"use client";

import Icon from "../ui/Icon";
import { OpenWhenNoteData } from "../OpenWhenNotes";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: OpenWhenNoteData | null;
}

export default function NoteModal({ isOpen, onClose, note }: NoteModalProps) {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-rose-950/40 backdrop-blur-md z-[150] flex items-center justify-center transition-opacity duration-300">
      <div className="bg-[#fff1f2] w-full max-w-md mx-4 rounded-3xl p-8 relative transform scale-100 transition-transform duration-300 shadow-2xl border border-white">
        {/* Paper Texture */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none rounded-3xl"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 z-20"
        >
          <Icon name="solar:close-circle-bold" width={28} />
        </button>

        <div className="relative z-10 text-center pt-4">
          <div className="w-12 h-12 bg-white text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100">
            <Icon name="solar:heart-text-bold" width={24} />
          </div>
          <h3 className="text-3xl font-dancing font-bold text-rose-800 mb-6">
            {note.title}
          </h3>
          <div className="max-h-[50vh] overflow-y-auto pr-2">
            <p className="text-rose-900/80 leading-loose font-playfair italic text-lg">
              {note.message}
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-rose-200/50 flex justify-center">
            <div className="h-8 text-rose-300/30 font-dancing text-2xl italic">
              With love
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
