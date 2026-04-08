"use client";

import { useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

/** Most recent featured products shown in the slice strip (desktop + mobile). */
const MAX_SLICES = 8;

interface SlicedPreviewProps {
  products: Product[];
}

function useTouchPrimaryUi() {
  const [touchPrimary, setTouchPrimary] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setTouchPrimary(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return touchPrimary;
}

export default function SlicedPreview({ products }: SlicedPreviewProps) {
  const touchPrimary = useTouchPrimaryUi();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [touchExpandedIdx, setTouchExpandedIdx] = useState<number | null>(null);

  const activeIdx = touchPrimary ? touchExpandedIdx : hoveredIdx;

  const slices = products
    .filter((p) => p.images.length > 0)
    .slice(0, MAX_SLICES);

  const basePercent = 100 / slices.length;
  const expandedPercent = basePercent * 2.5;

  if (slices.length === 0) return null;

  return (
    <section className="border-b border-neutral-200 overflow-hidden">
      <div
        className="flex h-[420px] md:h-[560px]"
        onMouseLeave={() => {
          if (!touchPrimary) setHoveredIdx(null);
        }}
      >
        {slices.map((product, idx) => {
          const img = product.images[0];
          const isActive = activeIdx === idx;
          const isIdle = activeIdx === null;

          const hoveredPercent = basePercent * 2.5;
          const otherPercent =
            slices.length > 1
              ? (100 - hoveredPercent) / (slices.length - 1)
              : 100;

          const width =
            slices.length === 1
              ? "100%"
              : isIdle
                ? `${basePercent}%`
                : isActive
                  ? `${hoveredPercent}%`
                  : `${otherPercent}%`;

          const imgWrapperWidth = `min(${expandedPercent}vw, ${(1400 * expandedPercent) / 100}px)`;

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="relative flex-shrink-0 overflow-hidden group cursor-pointer"
              style={{
                width,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => {
                if (!touchPrimary) setHoveredIdx(idx);
              }}
              onClick={(e) => {
                if (touchPrimary && touchExpandedIdx !== idx) {
                  e.preventDefault();
                  setTouchExpandedIdx(idx);
                }
              }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full"
                style={{ width: imgWrapperWidth }}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  quality={92}
                  sizes="(max-width: 768px) 85vw, 45vw"
                  priority={idx < 4}
                />
              </div>

              <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                  isActive ? "opacity-0" : "opacity-30"
                }`}
              />

              {idx < slices.length - 1 && (
                <div className="absolute top-0 right-0 bottom-0 w-px bg-white/30 z-10" />
              )}

              <div
                className={`absolute bottom-0 left-0 right-0 p-4 md:p-5 transition-all duration-300 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <div className="bg-white/95 backdrop-blur-sm p-3">
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 truncate">
                    {product.brand}
                  </p>
                  <p className="text-[12px] font-semibold leading-tight mt-0.5 truncate">
                    {product.name}
                  </p>
                  <p className="text-[12px] mt-1">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div
                className={`absolute top-4 left-0 right-0 flex justify-center transition-opacity duration-300 ${
                  isIdle ? "opacity-60" : "opacity-0"
                }`}
              >
                <span className="text-[9px] uppercase tracking-[0.2em] text-white font-medium">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400">
          <span className="md:hidden">Tap to expand · tap again to open</span>
          <span className="hidden md:inline">Hover to preview</span>
        </p>
        <Link
          href="/shop"
          className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors shrink-0"
        >
          View All →
        </Link>
      </div>
    </section>
  );
}
