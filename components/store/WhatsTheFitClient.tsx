"use client";

import { useEffect, useRef, useState } from "react";
import { useWtfTheme } from "@/context/WtfThemeContext";

export type WtfImagePublic = { id: string; url: string };

export default function WhatsTheFitClient({
  images,
}: {
  images: WtfImagePublic[];
}) {
  const { completeWtfEntrance, wtfSurfaceDark } = useWtfTheme();
  const [curtainGone, setCurtainGone] = useState(false);
  const [sweepIn, setSweepIn] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCurtainGone(true);
      completeWtfEntrance();
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSweepIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [completeWtfEntrance]);

  function handleTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.propertyName !== "transform" || completedRef.current) return;
    completedRef.current = true;
    setCurtainGone(true);
    completeWtfEntrance();
  }

  return (
    <>
      {!curtainGone && (
        <div
          aria-hidden
          className={`pointer-events-none fixed inset-0 z-[100] bg-black transition-transform duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
            sweepIn ? "translate-x-0" : "-translate-x-full"
          }`}
          onTransitionEnd={handleTransitionEnd}
        />
      )}

      <div
        className={`max-w-[1200px] mx-auto px-4 py-10 md:py-14 transition-colors duration-500 ${
          wtfSurfaceDark ? "text-white" : "text-neutral-900"
        }`}
      >
        <header className="mb-10 md:mb-14 text-center">
          <h1 className="text-[32px] md:text-[56px] font-black uppercase tracking-[-0.03em] leading-none mb-5 md:mb-6">
            WTF
          </h1>
          <p
            className={`text-[12px] md:text-[13px] max-w-lg mx-auto leading-relaxed transition-colors duration-500 ${
              wtfSurfaceDark ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            What&apos;s The Fit? Submitted by the community and curated here.
          </p>
        </header>

        {images.length === 0 ? (
          <p
            className={`text-center text-[12px] uppercase tracking-widest py-20 transition-colors duration-500 ${
              wtfSurfaceDark ? "text-neutral-500" : "text-neutral-400"
            }`}
          >
            Coming soon.
          </p>
        ) : (
          <div className="columns-2 md:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {images.map((img) => (
              <figure
                key={img.id}
                className="break-inside-avoid mb-3 md:mb-4 overflow-hidden bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-auto block align-middle"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
