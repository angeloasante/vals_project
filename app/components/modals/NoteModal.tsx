"use client";

import Icon from "../ui/Icon";

const notes = {
  mad: {
    title: "Take a Breath...",
    text: "I'm sorry if I made you mad. You know I never want to upset you. Just remember that we are on the same team. I love you, and I'm ready to listen whenever you are ready to talk. Let's fix this together.",
  },
  sad: {
    title: "Here's a Hug",
    text: "I wish I could be there to hold you right now. It's okay to not be okay sometimes. You are so strong, but you don't always have to be. I've got your back, always. This too shall pass, my love.",
  },
  miss: {
    title: "I Miss You Too",
    text: "Distance means so little when someone means so much. Close your eyes and feel my hand in yours. I am thinking about you right this second. Can't wait to see you again.",
  },
};

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteType: "mad" | "sad" | "miss" | null;
}

export default function NoteModal({ isOpen, onClose, noteType }: NoteModalProps) {
  if (!isOpen || !noteType) return null;

  const note = notes[noteType];

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
              {note.text}
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
