"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Sparkles, Info, BookOpen, CalendarDays, Globe, Bell, HeartHandshake, X } from "lucide-react";
import Link from "next/link";

export default function MaintenanceDialog({ open, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-title"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6"
      >
        <div className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className="p-8 md:p-10 flex flex-col gap-8">
            {/* Top section: Image + Text */}
            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
              {/* Left Image */}
              <div className="w-full md:w-1/3 flex justify-center shrink-0">
                <Image
                  src="/image_for_maintanance.png"
                  alt="Growing seed"
                  width={220}
                  height={280}
                  className="object-contain max-h-[300px]"
                />
              </div>

              {/* Right Text Content */}
              <div className="w-full md:w-2/3 flex flex-col gap-5 pt-2">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f0fdf4] text-green-700 rounded-full w-fit font-medium text-sm">
                  <Sparkles size={16} className="text-yellow-500" />
                  Exciting Upgrade Ahead
                </div>

                {/* Heading */}
                <h2 id="maintenance-title" className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  SeedofCode is <br />
                  <span className="text-[#3a9643]">being rebuilt 🌱</span>
                </h2>

                <p className="text-gray-600 text-[1.05rem] leading-relaxed">
                  We&apos;re rebuilding SeedofCode from the ground up to deliver a faster, more powerful AI learning experience.
                </p>

                {/* Info Card 1 */}
                <div className="flex items-start gap-4 p-4 bg-[#f9fdfa] border border-[#dcfce7] rounded-xl mt-2">
                  <div className="p-1 rounded-full text-green-600 shrink-0 border-2 border-green-600 mt-0.5">
                    <Info size={16} strokeWidth={3} />
                  </div>
                  <p className="text-gray-700 font-medium text-sm md:text-[0.95rem] leading-snug">
                    During this transition, creating new AI courses has been temporarily disabled.
                  </p>
                </div>

                {/* Info Note 2 */}
                <div className="flex items-start gap-4 p-2 px-3">
                  <BookOpen size={28} className="text-[#3a9643] shrink-0" strokeWidth={1.5} />
                  <p className="text-gray-600 text-sm md:text-[0.95rem] leading-snug mt-0.5">
                    You can still access and continue learning from all of your previously created courses.
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Section: Date & Link Card */}
            <div className="flex flex-col md:flex-row w-full border border-green-200/60 rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="flex-1 p-5 md:p-6 flex items-center gap-5 border-b md:border-b-0 md:border-r border-green-200/60">
                <div className="p-2.5 bg-green-50 text-green-700 rounded-xl">
                  <CalendarDays size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-0.5">The new experience launches on</p>
                  <p className="text-green-800 font-bold text-xl md:text-2xl tracking-tight">5 September 2026</p>
                </div>
              </div>
              <div className="flex-1 p-5 md:p-6 flex items-center gap-5">
                <div className="p-2.5 bg-green-50 text-green-700 rounded-xl">
                  <Globe size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-0.5">Visit</p>
                  <Link href="https://seedofcode.dev" target="_blank" className="text-green-700 hover:text-green-800 font-bold text-xl md:text-2xl tracking-tight hover:underline transition-all">
                    seedofcode.dev
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Section: Buttons */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-3 bg-[#429546] hover:bg-[#347837] text-white p-4 rounded-xl transition-all shadow-lg shadow-green-700/20 active:scale-[0.98]"
              >
                <Bell size={24} />
                <div className="flex flex-col items-start">
                  <span className="font-bold text-lg leading-none mb-1">Notify Me</span>
                  <span className="text-green-100 text-xs font-medium">I want to be the first to know</span>
                </div>
              </button>

              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 p-4 rounded-xl transition-all shadow-sm active:scale-[0.98]"
              >
                <BookOpen size={24} className="text-gray-700" />
                <div className="flex flex-col items-start">
                  <span className="font-bold text-lg leading-none mb-1">Browse My Courses</span>
                  <span className="text-gray-500 text-xs font-medium">Go to my courses</span>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium pt-2">
              <HeartHandshake size={20} className="text-[#429546]" />
              Thank you for being part of SeedofCode&apos;s journey.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
