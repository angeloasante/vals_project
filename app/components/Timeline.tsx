"use client";

import Image from "next/image";
import Icon from "./ui/Icon";
import GlassCard from "./ui/GlassCard";
import { useScrollReveal } from "../hooks/useScrollReveal";

export interface TimelineItemData {
  id?: string;
  label: string;
  title: string;
  description: string;
  imageSrc?: string;
}

interface TimelineItemProps {
  label: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: string;
  iconBgColor: string;
  iconTextColor?: string;
  imageRotation?: string;
  isReversed?: boolean;
}

function TimelineItem({
  label,
  title,
  description,
  imageSrc,
  imageAlt,
  icon,
  iconBgColor,
  iconTextColor = "text-white",
  imageRotation = "rotate-2",
  isReversed = false,
}: TimelineItemProps) {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center reveal-on-scroll"
    >
      <div
        className={`${isReversed ? "md:text-right order-2 md:order-1 pr-8 md:pr-0" : "md:text-right order-2 md:order-1"}`}
      >
        {isReversed ? (
          <GlassCard
            className={`p-2 rounded-2xl ${imageRotation} hover:rotate-0 transition-transform duration-500 w-fit ml-auto`}
          >
            <div className="relative w-48 h-32">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="rounded-xl object-cover"
                sizes="192px"
                quality={75}
              />
            </div>
          </GlassCard>
        ) : (
          <>
            <span className="text-rose-300 font-mono text-xs mb-2 block">
              {label}
            </span>
            <h3 className="text-2xl font-medium text-white mb-2">{title}</h3>
            <p className="text-rose-100/70 font-light text-sm leading-relaxed">
              {description}
            </p>
          </>
        )}
      </div>

      <div
        className={`absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full ${iconBgColor} border-4 border-rose-900 z-10 ${iconTextColor} shadow-lg shadow-rose-500/50`}
      >
        <Icon name={icon} width={16} />
      </div>

      <div className={`${isReversed ? "order-1 md:order-2" : "order-1 md:order-2 pl-8 md:pl-0"}`}>
        {isReversed ? (
          <>
            <span className="text-rose-300 font-mono text-xs mb-2 block">
              {label}
            </span>
            <h3 className="text-2xl font-medium text-white mb-2">{title}</h3>
            <p className="text-rose-100/70 font-light text-sm leading-relaxed">
              {description}
            </p>
          </>
        ) : (
          <GlassCard
            className={`p-2 rounded-2xl ${imageRotation} hover:rotate-0 transition-transform duration-500 w-fit mx-auto md:mx-0`}
          >
            <div className="relative w-48 h-32">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="rounded-xl object-cover"
                sizes="192px"
                quality={75}
              />
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

const DEFAULT_MEMORIES: TimelineItemData[] = [
  {
    label: "First Hello",
    title: "The Day We Met",
    description:
      "King's who's D prettiest? You. Always you. 👑 The moment I first saw that beautiful face, I knew.",
    imageSrc: "/first-hello.jpeg",
}, { label: "First Video Call", title: "Magic in the Air", description: "I was so nervous, but your smile melted it all away. Best night ever.", imageSrc: "/17E14704-47B0-4053-BEA7-39C5ED8CA06F_1_105_c.jpeg",
  },
  {
    label: "Our Adventures",
    title: "Making Memories",
    description:
      "Every moment with you is an adventure. You make the ordinary feel extraordinary.",
    imageSrc: "/1A4D7476-E890-44CF-80DA-55CE1499350B_1_105_c.jpeg",
  },
  {
    label: "That Smile",
    title: "What Caught Me",
    description:
      "That smile is what caught me. One look and I was done. 😍",
    imageSrc: "/85D5212E-8A69-411E-97A8-4F8912F6E834_1_105_c.jpeg",
  },
  {
    label: "Special Moments",
    title: "Our Favorite Times",
    description:
      "The laughs, the looks, the love. Every second with you is special.",
    imageSrc: "/940DDE17-DF81-4F1C-85B5-E7A6760B61EC_1_105_c.jpeg",
  },
  {
    label: "Present Day",
    title: "Still Falling",
    description:
      "Every single day, I find a new reason to love you more than yesterday.",
    imageSrc: "/E5A594E5-EBCD-426C-806F-02DF107226FC_1_105_c.jpeg",
  },
  {
    label: "Forever",
    title: "My Everything",
    description:
      "You're my past, my present, and my future. I love you endlessly. 💕",
    imageSrc: "/F656920B-3710-47AC-882E-BB42C321FFB3_1_105_c.jpeg",
  },
];

// Icons and colors to cycle through for timeline items
const timelineStyles = [
  { icon: "solar:chat-round-line-linear", iconBgColor: "bg-rose-500", imageRotation: "rotate-2", isReversed: false },
  { icon: "solar:wineglass-linear", iconBgColor: "bg-rose-400", imageRotation: "-rotate-2", isReversed: true },
  { icon: "solar:map-point-wave-linear", iconBgColor: "bg-rose-400", imageRotation: "rotate-1", isReversed: false },
  { icon: "solar:users-group-two-rounded-linear", iconBgColor: "bg-rose-300", imageRotation: "-rotate-1", isReversed: true },
  { icon: "solar:star-shine-linear", iconBgColor: "bg-rose-400", imageRotation: "rotate-2", isReversed: false },
  { icon: "solar:heart-bold", iconBgColor: "bg-rose-300", iconTextColor: "text-rose-900", imageRotation: "rotate-1", isReversed: true },
  { icon: "solar:infinity-linear", iconBgColor: "bg-rose-500", imageRotation: "-rotate-2", isReversed: false },
];

interface TimelineProps {
  items?: TimelineItemData[];
}

export default function Timeline({ items }: TimelineProps) {
  const headerRef = useScrollReveal();

  // Use provided items or default demo items
  const timelineItems = items && items.length > 0 ? items : DEFAULT_MEMORIES;

  return (
    <div id="memories" className="mb-32 relative">
      <div ref={headerRef} className="text-center mb-16 reveal-on-scroll">
        <h2 className="text-4xl font-playfair text-white mb-2">Our Story</h2>
        <p className="text-rose-200/60 text-sm tracking-wide uppercase">
          How it all began
        </p>
      </div>

      <div className="relative space-y-12 py-8">
        <div className="timeline-line" />
        {timelineItems.map((memory, index) => {
          const style = timelineStyles[index % timelineStyles.length];
          return (
            <TimelineItem 
              key={memory.id || index} 
              label={memory.label}
              title={memory.title}
              description={memory.description}
              imageSrc={memory.imageSrc || "/first-hello.jpeg"}
              imageAlt={memory.title}
              icon={style.icon}
              iconBgColor={style.iconBgColor}
              iconTextColor={style.iconTextColor}
              imageRotation={style.imageRotation}
              isReversed={style.isReversed}
            />
          );
        })}
      </div>
    </div>
  );
}
