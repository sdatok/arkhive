import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { revalidateProductPages } from "@/lib/revalidate-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { displayOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, brand, slug, description, price, category, status, sizes, sizePricing, quantity, images } = body;

    if (!name || !brand || !slug || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        slug,
        description: description ?? "",
        price,
        category,
        status: status ?? "DRAFT",
        sizes: sizes ?? [],
        sizePricing: sizePricing ?? null,
        quantity: quantity ?? 1,
        images: {
          create: (images ?? []).map(
            (img: { url: string; displayOrder: number }) => ({
              url: img.url,
              displayOrder: img.displayOrder,
            })
          ),
        },
      },
      include: { images: true },
    });

    revalidateProductPages(product.slug);
    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Failed to create product";
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
