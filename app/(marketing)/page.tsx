"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate hearts on client side only
    setHearts(
      [...Array(20)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 40 + 20,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
      }))
    );
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute text-white/10"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              fontSize: `${heart.size}px`,
              animation: `float ${heart.duration}s ease-in-out infinite`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-white font-dancing">
            vals.love
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-white hover:text-white/80 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-white text-rose-600 px-5 py-2 rounded-full font-semibold hover:bg-rose-50 transition-colors"
            >
              Create Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-16 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            ✨ Free forever • No credit card needed
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Create a{" "}
            <span className="font-dancing">beautiful</span>
            <br />
            love page for your
            <br />
            special person 💕
          </h1>
          
          <p className="text-xl text-rose-100 mb-10 max-w-2xl mx-auto">
            A stunning interactive website to express your love. Add photos, poems, 
            memories, and more. Share it with a custom link they&apos;ll never forget.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-rose-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-50 hover:scale-105 transition-all shadow-xl shadow-rose-900/20"
            >
              Create My Love Page →
            </Link>
            <Link
              href="/u/demo"
              className="text-white border-2 border-white/50 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              See Example
            </Link>
          </div>
        </div>

        {/* Preview Mockup */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative">
            {/* Browser Frame */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Browser Header */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-gray-500 text-center">
                    vals.love/u/yourname
                  </div>
                </div>
              </div>
              {/* Preview Content */}
              <div className="bg-rose-600 p-8 md:p-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-dancing">
                  To My Everything
                </h2>
                <p className="text-rose-100 text-lg mb-8">
                  A little corner of the internet, just for you 💕
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {["Gallery", "Poems", "Timeline", "Love Card"].map((item) => (
                    <div
                      key={item}
                      className="bg-white/20 backdrop-blur rounded-xl p-4 text-white text-sm font-medium"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 text-6xl">💝</div>
            <div className="absolute -bottom-4 -left-4 text-6xl">💌</div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Everything you need to express your love
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "📸",
                title: "Photo Gallery",
                description: "Upload your favorite memories with swipeable Tinder-style gallery",
              },
              {
                emoji: "💌",
                title: "Love Poems",
                description: "Add heartfelt poems and messages in a beautiful flip book",
              },
              {
                emoji: "📅",
                title: "Timeline",
                description: "Share your love story from the first hello to forever",
              },
              {
                emoji: "💕",
                title: "Valentine Card",
                description: "Interactive 'Will you be my Valentine?' with fun animations",
              },
              {
                emoji: "🎵",
                title: "Your Song",
                description: "Add background music that plays when they visit",
              },
              {
                emoji: "🎟️",
                title: "Love Coupons",
                description: "Redeemable coupons for dates, massages, and more",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/20 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-rose-100/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to make someone feel special?
          </h2>
          <p className="text-rose-100 text-lg mb-8">
            Create your page in minutes. Share it with a link.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-rose-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-rose-50 hover:scale-105 transition-all shadow-xl"
          >
            Start Creating — It&apos;s Free 💕
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-white/60 text-sm">
            <span>© 2026 vals.love</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Made with 💕 by{" "}
              <a href="https://travismoore.com" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                Travis Moore
              </a>
            </span>
          </div>
          <div className="flex gap-6 text-white/60 text-sm">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
