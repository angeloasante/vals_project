"use client";

import Icon from "./ui/Icon";
import GlassCard from "./ui/GlassCard";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface BucketListItemProps {
  text: string;
  completed?: boolean;
}

function BucketListItem({ text, completed = false }: BucketListItemProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
          completed
            ? "bg-rose-500 text-white"
            : "border border-rose-300/30 group-hover:border-rose-400"
        }`}
      >
        {completed && <Icon name="solar:check-read-linear" />}
      </div>
      <span
        className={`${
          completed
            ? "text-rose-200 line-through decoration-rose-500/50"
            : "text-white"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

const bucketListItems = [
  { text: "Raising a Pengu together😂", completed: true },
  { text: "Stay on a call 24hrs NB: long distance is a b!tch", completed: true },
  { text: "Travel to the world together", completed: false },
  { text: "Adopt a puppy", completed: false },
  { text: "Fuck the hell out of each other", completed: false },
];

export default function BucketList() {
  const ref = useScrollReveal();

  return (
    <div ref={ref} id="bucketlist" className="reveal-on-scroll">
      <GlassCard dark className="rounded-3xl p-8 mb-32 border border-white/10">
        <h2 className="text-2xl font-playfair text-white mb-6 flex items-center gap-3">
          <Icon name="solar:checklist-minimalistic-linear" />
          Our Bucket List
        </h2>
        <div className="space-y-3">
          {bucketListItems.map((item, index) => (
            <BucketListItem key={index} {...item} />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
