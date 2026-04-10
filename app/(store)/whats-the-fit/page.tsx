import { prisma } from "@/lib/db";
import { sortWithFeaturedBias } from "@/lib/shuffle";
import WhatsTheFitClient from "@/components/store/WhatsTheFitClient";

export const metadata = {
  title: "What's The Fit - ARKHIVE",
  description:
    "What's The Fit? Submitted by the community and curated here.",
};

export const dynamic = "force-dynamic";

export default async function WhatsTheFitPage() {
  const rows = await prisma.wtfImage.findMany({
    orderBy: { displayOrder: "asc" },
  });

  const images = sortWithFeaturedBias(rows).map((r) => ({
    id: r.id,
    url: r.url,
  }));

  return <WhatsTheFitClient images={images} />;
}
