"use client";

import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { createConfetti } from "../utils/effects";

interface CouponProps {
  title: string;
  subtitle: string;
}

function Coupon({ title, subtitle }: CouponProps) {
  const [redeemed, setRedeemed] = useState(false);

  const handleRedeem = () => {
    if (redeemed) return;
    setRedeemed(true);
    createConfetti();
  };

  return (
    <div
      onClick={handleRedeem}
      role="button"
      aria-label={`${redeemed ? "Redeemed" : "Redeem"} coupon: ${title} - ${subtitle}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleRedeem(); }}
      className={`w-full md:w-64 h-32 bg-white rounded-xl relative overflow-hidden flex shadow-lg group hover:-translate-y-1 transition-transform cursor-pointer ${
        redeemed ? "opacity-75 grayscale" : ""
      }`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-rose-600 flex flex-col items-center justify-center border-r-2 border-dashed border-rose-400">
        <span
          className="text-white text-[10px] font-bold"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          ADMIT ONE
        </span>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
        <h3 className="font-playfair font-bold text-rose-900 text-lg">{title}</h3>
        <p className="text-[11px] text-rose-700 uppercase tracking-widest mt-1 font-medium">
          {subtitle}
        </p>
        <div
          className={`mt-2 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
            redeemed
              ? "bg-zinc-800 text-white"
              : "bg-rose-600 text-white group-hover:bg-rose-700"
          }`}
        >
          {redeemed ? "Redeemed!" : "Redeem"}
        </div>
      </div>
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#be123c] rounded-full" />
    </div>
  );
}

const coupons = [
  { title: "Back Massage", subtitle: "20 Mins" },
  { title: "Dinner Date", subtitle: "My Treat" },
  { title: "Forgiveness", subtitle: "End 1 Argument" },
];

export default function LoveCoupons() {
  const headerRef = useScrollReveal();

  return (
    <div id="coupons" className="mb-20">
      <div ref={headerRef} className="text-center mb-10 reveal-on-scroll">
        <h2 className="text-3xl font-playfair text-white">Love Coupons</h2>
        <p className="text-rose-200/60 text-sm mt-2">
          Redeemable whenever you want
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {coupons.map((coupon, index) => (
          <Coupon key={index} {...coupon} />
        ))}
      </div>
    </div>
  );
}
