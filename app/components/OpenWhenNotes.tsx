"use client";

import Icon from "./ui/Icon";
import { useScrollReveal } from "../hooks/useScrollReveal";

export interface OpenWhenNoteData {
  id?: string;
  type: string;
  title: string;
  message: string;
  icon: string;
  iconColor: string;
}

interface EnvelopeNoteProps {
  icon: string;
  iconColor: string;
  title: string;
  onClick: () => void;
  delay?: string;
}

function EnvelopeNote({
  icon,
  iconColor,
  title,
  onClick,
  delay = "",
}: EnvelopeNoteProps) {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group cursor-pointer perspective-1000 reveal-on-scroll ${delay}`}
    >
      <div className="relative h-40 w-full transition-all duration-500 group-hover:-translate-y-2">
        <div className="absolute inset-0 bg-white shadow-xl rounded-lg z-10 flex flex-col items-center justify-center border-b-2 border-rose-100">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-rose-50 rounded-t-lg border-b border-rose-100 z-20 envelope-flap shadow-sm origin-top" />
          <div className="mt-8 text-center z-10">
            <Icon name={icon} className={`${iconColor} text-2xl mb-1`} width={24} />
            <p className="font-dancing text-xl text-rose-900 font-bold">{title}</p>
          </div>
        </div>
        <div className="absolute top-2 left-2 right-2 bottom-0 bg-rose-200 rounded-lg -z-10 transform scale-95 group-hover:translate-y-2 transition-transform" />
      </div>
    </div>
  );
}

const DEFAULT_NOTES: OpenWhenNoteData[] = [
  {
    type: "mad",
    icon: "solar:fire-linear",
    iconColor: "text-rose-400",
    title: "You're Mad",
    message: "I'm sorry if I made you mad. You know I never want to upset you. Just remember that we are on the same team. I love you, and I'm ready to listen whenever you are ready to talk. Let's fix this together.",
  },
  {
    type: "sad",
    icon: "solar:cloud-rain-linear",
    iconColor: "text-blue-400",
    title: "You're Sad",
    message: "I wish I could be there to hold you right now. It's okay to not be okay sometimes. You are so strong, but you don't always have to be. I've got your back, always. This too shall pass, my love.",
  },
  {
    type: "miss",
    icon: "solar:map-point-search-linear",
    iconColor: "text-rose-400",
    title: "Miss Me",
    message: "Distance means so little when someone means so much. Close your eyes and feel my hand in yours. I am thinking about you right this second. Can't wait to see you again.",
  },
];

interface OpenWhenNotesProps {
  notes?: OpenWhenNoteData[];
  onOpenNote: (note: OpenWhenNoteData) => void;
}

export default function OpenWhenNotes({ notes, onOpenNote }: OpenWhenNotesProps) {
  const headerRef = useScrollReveal();
  const noteList = notes && notes.length > 0 ? notes : DEFAULT_NOTES;

  return (
    <div className="mb-32">
      <div
        ref={headerRef}
        className="flex items-center justify-between mb-8 px-2 reveal-on-scroll"
      >
        <h2 className="text-3xl md:text-4xl font-playfair text-white">
          Open When...
        </h2>
        <Icon name="solar:letter-heart-linear" className="text-rose-200 text-2xl" width={24} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {noteList.map((note, index) => (
          <EnvelopeNote
            key={note.id || index}
            icon={note.icon}
            iconColor={note.iconColor}
            title={note.title}
            onClick={() => onOpenNote(note)}
            delay={index > 0 ? `delay-${index * 100}` : undefined}
          />
        ))}
      </div>
    </div>
  );
}
