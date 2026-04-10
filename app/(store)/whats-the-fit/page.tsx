import { prisma } from "@/lib/db";
import { sortWithFeaturedBias } from "@/lib/shuffle";

export const metadata = {
  title: "WTF - ARKHIVE",
  description: "Community fit pics, curated at ARKHIVE.",
};

export const dynamic = "force-dynamic";

export default async function WhatsTheFitPage() {
  const rows = await prisma.wtfImage.findMany({
    orderBy: { displayOrder: "asc" },
  });

  const images = sortWithFeaturedBias(rows);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 md:py-14 bg-white">
      {images.length === 0 ? (
        <p className="text-center text-[12px] text-neutral-400 uppercase tracking-widest py-20">
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
  );
}
