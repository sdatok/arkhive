import { prisma } from "@/lib/db";
import WtfImageManager from "@/components/admin/WtfImageManager";

export const dynamic = "force-dynamic";

export default async function AdminWtfPage() {
  const images = await prisma.wtfImage.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[18px] font-bold">What&apos;s The Fit</h1>
        <p className="text-[12px] text-neutral-500 mt-0.5">
          Upload images for the public{" "}
          <a
            href="/whats-the-fit"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-black"
          >
            WTF
          </a>{" "}
          page. They appear in a loose column layout (newest additions at the end until you
          reorder).
        </p>
      </div>

      <WtfImageManager
        initialImages={images.map((i) => ({
          id: i.id,
          url: i.url,
          displayOrder: i.displayOrder,
        }))}
      />
    </div>
  );
}
