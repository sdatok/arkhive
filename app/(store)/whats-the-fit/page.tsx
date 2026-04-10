import { prisma } from "@/lib/db";
import { shuffle } from "@/lib/shuffle";

export const metadata = {
  title: "What's The Fit — ARKHIVE",
  description:
    "Community-sourced fits and references — a living wall of how people are wearing it.",
};

export const dynamic = "force-dynamic";

export default async function WhatsTheFitPage() {
  const rows = await prisma.wtfImage.findMany({
    orderBy: { displayOrder: "asc" },
  });

  const featured = rows.filter((r) => r.featured);
  const rest = rows.filter((r) => !r.featured);
  const images = [...shuffle(featured), ...shuffle(rest)];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 md:py-14">
      <header className="mb-10 md:mb-14 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 mb-2">
          ARKHIVE
        </p>
        <h1 className="text-[22px] md:text-[28px] font-black uppercase tracking-[0.12em]">
          What&apos;s The Fit
        </h1>
        <p className="text-[12px] text-neutral-500 mt-3 max-w-lg mx-auto leading-relaxed">
          Fits, mirrors, and streets — submitted by the community and curated here. A
          soft archive of how people are actually wearing things right now.
        </p>
      </header>

      {images.length === 0 ? (
        <p className="text-center text-[12px] text-neutral-400 uppercase tracking-widest py-20">
          Coming soon.
        </p>
      ) : (
        <div className="columns-2 sm:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
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
  );
}
