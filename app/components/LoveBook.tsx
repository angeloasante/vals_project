"use client";

import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const POEMS = [
  {
    title: "Real Talk 😂",
    lines: [
      "Have you seen your ass and boobs girllllllll?!",
      "I mean... DAMN. 👀",
      "",
      "But for real though...",
      "You're not just fine as hell,",
      "You got my heart under a spell.",
      "",
      "Beauty, brains, and all that sass,",
      "Baby you're top tier, first class. 🔥",
      "",
      "(Turn the page for the romantic stuff 💕)",
    ],
  },
  {
    title: "I'm Sorry 💔",
    lines: [
      "I'm the boy who disappears,",
      "Who's caused you pain and tears.",
      "I say sorry every time,",
      "Then repeat the same old crime.",
      "",
      "I know I mess up, fade away,",
      "Promise to change another day.",
      "My actions don't match my words,",
      "I know that sounds absurd.",
      "",
      "But through it all, this much is true,",
      "I'll never stop loving you.",
      "You deserve the world and more,",
      "You're the one I'm fighting for. 💕",
    ],
  },
  {
    title: "Only You",
    lines: [
      "There's no one else who compares,",
      "To the way you show you care.",
      "Your beauty takes my breath away,",
      "I fall deeper every single day.",
      "",
      "You're my sunrise, you're my moon,",
      "My favorite song, my sweetest tune.",
      "Forever yours, forever true,",
      "My heart belongs only to you. 💝",
    ],
  },
  {
    title: "Beautiful You",
    lines: [
      "The way you walk, the way you move,",
      "Everything about you I approve.",
      "Your curves, your grace, your gentle touch,",
      "I can never get enough.",
      "",
      "You drive me crazy, make me weak,",
      "You're the treasure that I seek.",
      "So perfect in every single way,",
      "I thank God for you every day. 🌹",
    ],
  },
  {
    title: "My Queen",
    lines: [
      "You're the baddest, that's no lie,",
      "The most beautiful beneath the sky.",
      "Your body's art, your soul's divine,",
      "I'm so blessed that you are mine.",
      "",
      "You make me feel so alive,",
      "With you by my side I thrive.",
      "My queen, my love, my everything,",
      "To you my heart I'll always bring. 👑",
    ],
  },
  {
    title: "Obsessed",
    lines: [
      "I'm obsessed with all you are,",
      "My guiding light, my brightest star.",
      "The way you taste, the way you feel,",
      "This love we have is so real.",
      "",
      "I want you close both day and night,",
      "Holding you just feels so right.",
      "You're my addiction, my desire,",
      "You set my whole soul on fire. 🔥",
    ],
  },
  {
    title: "Forever Yours",
    lines: [
      "From now until the end of time,",
      "I promise you that you'll be mine.",
      "Through every storm and sunny day,",
      "By your side I'll always stay.",
      "",
      "You're my beginning and my end,",
      "My lover and my best friend.",
      "So take my hand and hold it tight,",
      "I'll love you with all my might. 💍",
    ],
  },
];

export default function LoveBook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(null);
  const headerRef = useScrollReveal();

  const totalPages = POEMS.length;

  const goToNextPage = () => {
    if (isFlipping || currentPage >= totalPages - 1) return;
    setFlipDirection("right");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  };

  const goToPrevPage = () => {
    if (isFlipping || currentPage <= 0) return;
    setFlipDirection("left");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  };

  const leftPoem = currentPage > 0 ? POEMS[currentPage - 1] : null;
  const rightPoem = POEMS[currentPage];

  return (
    <div className="mb-32">
      <div ref={headerRef} className="text-center mb-10 reveal-on-scroll">
        <h2 className="text-4xl font-playfair text-white mb-2">Love Letters</h2>
        <p className="text-rose-200/60 text-sm tracking-wide uppercase">
          Tap the pages to read more
        </p>
      </div>

      {/* Book Container */}
      <div className="flex justify-center perspective-[2000px]">
        <div className="relative w-full max-w-3xl">
          {/* Book Shadow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/30 blur-xl rounded-full" />

          {/* Book */}
          <div className="relative flex bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg shadow-2xl overflow-hidden min-h-[400px] md:min-h-[450px]">
            {/* Book Spine */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 z-30 shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.3)_50%,transparent_100%)]" />
              {/* Spine details */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-600/50 rounded-full" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-600/50 rounded-full" />
            </div>

            {/* Left Page */}
            <div
              onClick={goToPrevPage}
              className={`flex-1 relative cursor-pointer transition-all duration-300 ${
                currentPage === 0 ? "cursor-default" : "hover:bg-amber-50"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-amber-50">
                {/* Paper texture */}
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
                {/* Page edge shadow */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-200/50 to-transparent" />
              </div>

              <div className="relative p-6 md:p-10 h-full flex flex-col">
                {leftPoem ? (
                  <>
                    <h3 className="font-dancing text-2xl md:text-3xl text-amber-900 mb-4 md:mb-6 text-center">
                      {leftPoem.title}
                    </h3>
                    <div className="flex-1 flex flex-col justify-center">
                      {leftPoem.lines.map((line, idx) => (
                        <p
                          key={idx}
                          className={`font-playfair italic text-amber-800/90 text-sm md:text-base leading-relaxed text-center ${
                            line === "" ? "h-4" : ""
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className="text-center text-amber-600/50 text-xs mt-4">
                      — Page {currentPage} —
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-amber-700/40">
                    <div className="text-6xl mb-4">📖</div>
                    <p className="font-dancing text-xl">For My Love</p>
                    <p className="text-sm mt-2 font-playfair italic">A collection of poems</p>
                  </div>
                )}

                {/* Page turn hint - left */}
                {currentPage > 0 && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-400/30 animate-pulse">
                    ‹
                  </div>
                )}
              </div>
            </div>

            {/* Right Page */}
            <div
              onClick={goToNextPage}
              className={`flex-1 relative cursor-pointer transition-all duration-300 ${
                currentPage >= totalPages - 1 ? "cursor-default" : "hover:bg-amber-50"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-amber-100 to-amber-50">
                {/* Paper texture */}
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
                {/* Page edge shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-200/50 to-transparent" />
              </div>

              <div className="relative p-6 md:p-10 h-full flex flex-col">
                <h3 className="font-dancing text-2xl md:text-3xl text-amber-900 mb-4 md:mb-6 text-center">
                  {rightPoem.title}
                </h3>
                <div className="flex-1 flex flex-col justify-center">
                  {rightPoem.lines.map((line, idx) => (
                    <p
                      key={idx}
                      className={`font-playfair italic text-amber-800/90 text-sm md:text-base leading-relaxed text-center ${
                        line === "" ? "h-4" : ""
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <div className="text-center text-amber-600/50 text-xs mt-4">
                  — Page {currentPage + 1} —
                </div>

                {/* Page turn hint - right */}
                {currentPage < totalPages - 1 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-400/30 animate-pulse">
                    ›
                  </div>
                )}
              </div>

              {/* Flipping Page Animation */}
              {isFlipping && flipDirection === "right" && (
                <div
                  className="absolute inset-0 bg-gradient-to-l from-amber-100 to-amber-50 origin-left animate-page-flip-right z-20"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
                </div>
              )}
            </div>

            {/* Left page flip animation */}
            {isFlipping && flipDirection === "left" && (
              <div
                className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-amber-100 to-amber-50 origin-right animate-page-flip-left z-20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
              </div>
            )}
          </div>

          {/* Page indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {POEMS.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to poem ${idx + 1}`}
                onClick={() => {
                  if (idx > currentPage) {
                    setCurrentPage(idx);
                  } else if (idx < currentPage) {
                    setCurrentPage(idx);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage
                    ? "bg-white w-6"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
