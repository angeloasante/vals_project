"use client";

import Icon from "./ui/Icon";

export default function BackgroundEffects() {
  return (
    <>
      {/* Background Grain */}
      <div className="bg-grain" />

      {/* Floating Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[10%] text-rose-300/20 animate-float">
          <Icon name="solar:heart-bold" width={40} />
        </div>
        <div className="absolute top-[30%] right-[15%] text-rose-300/10 animate-float-delayed">
          <Icon name="solar:star-bold" width={30} />
        </div>
        <div className="absolute bottom-[20%] left-[20%] text-rose-300/15 animate-float">
          <Icon name="solar:rose-bold" width={50} />
        </div>
      </div>
    </>
  );
}
