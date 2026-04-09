"use client";

import { useState } from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Jordan M.",
    location: "Los Angeles, CA",
    rating: 5,
    date: "March 2025",
    item: "Arc'teryx Beta AR Jacket",
    text: "Honestly couldn't believe the condition this came in. Looked brand new. Packaged super carefully and shipped fast. Will definitely be buying from ARKHIVE again.",
  },
  {
    id: 2,
    name: "Priya S.",
    location: "New York, NY",
    rating: 5,
    date: "February 2025",
    item: "Vale Forever Venus Zip Up",
    text: "The pink on this is perfect, photos don't do it justice. Fits exactly as described. Communication was great and the whole process was smooth.",
  },
  {
    id: 3,
    name: "Marcus T.",
    location: "London, UK",
    rating: 5,
    date: "January 2025",
    item: "Stone Island Shadow Project Hoodie",
    text: "Sold a piece through ARKHIVE and the process was seamless. Got a fair offer, item was picked up same week. No nonsense — exactly what you want.",
  },
  {
    id: 4,
    name: "Camille R.",
    location: "Chicago, IL",
    rating: 5,
    date: "March 2025",
    item: "Supreme Box Logo Crewneck",
    text: "They authenticated everything properly and the listing photos were spot on. Bought with zero hesitation — exactly the level of trust you want when shopping resale.",
  },
  {
    id: 5,
    name: "Ethan K.",
    location: "Miami, FL",
    rating: 5,
    date: "April 2025",
    item: "Fear of God Essentials Pants",
    text: "Clean site, easy to browse, fair prices. Got my order in two days. The item was exactly as described — really solid experience start to finish.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < count ? "text-black" : "text-neutral-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [active, setActive] = useState(0);
  const visible = REVIEWS;

  return (
    <section className="border-t border-neutral-200 py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
              What People Say
            </p>
            <h2 className="text-[22px] font-black uppercase tracking-tight leading-none">
              Reviews
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <Stars count={5} />
            <span className="text-[11px] text-neutral-500 ml-2">
              5.0 · {REVIEWS.length} reviews
            </span>
          </div>
        </div>

        {/* Cards — horizontal scroll on mobile, grid on desktop */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-px bg-white">
          {visible.map((review) => (
            <div key={review.id} className="flex flex-col gap-3 bg-white p-5">
              <Stars count={review.rating} />
              <p className="text-[12px] leading-relaxed text-neutral-700 flex-1">
                "{review.text}"
              </p>
              <div>
                <p className="text-[11px] font-semibold">{review.name}</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
                  {review.location}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  {review.item}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="bg-white border border-neutral-200 p-6 min-h-[220px] flex flex-col gap-3">
            <Stars count={visible[active].rating} />
            <p className="text-[13px] leading-relaxed text-neutral-700 flex-1">
              "{visible[active].text}"
            </p>
            <div>
              <p className="text-[12px] font-semibold">{visible[active].name}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
                {visible[active].location}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                {visible[active].item}
              </p>
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {visible.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === active ? "bg-black" : "bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
