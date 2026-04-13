/**
 * Seed script: inserts initial Vale Forever products.
 * Run with: npm run seed
 *
 * Images are served from /public/products/ as static files.
 * When you set up Vercel Blob later, re-upload the images via the admin panel
 * and update the URLs to Blob URLs.
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest
        .join("=")
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }
}

const prisma = new PrismaClient();

const products = [
  {
    slug: "vale-forever-venus-zip-up-pink",
    name: "Vale Forever Venus Zip Up 'Pink'",
    brand: "Vale Forever",
    description:
      "The Vale Forever Venus Zip Up in Pink. A statement piece blending luxury comfort with streetwear edge. Full-zip construction with a clean minimal silhouette.",
    price: 250,
    category: "Tops",
    status: "ACTIVE" as const,
    sizes: ["S"],
    images: [{ url: "/products/valepink.jpg", displayOrder: 0 }],
  },
  {
    slug: "vale-forever-classico-zip-up-black",
    name: "Vale Forever Classico Zip Up 'Black'",
    brand: "Vale Forever",
    description:
      "The Vale Forever Classico Zip Up in Black. A timeless colourway on a premium zip-up silhouette. Versatile enough for any fit.",
    price: 250,
    category: "Tops",
    status: "ACTIVE" as const,
    sizes: ["L"],
    images: [
      { url: "/products/valedreams.jpg", displayOrder: 0 },
      { url: "/products/valedreamsback.jpg", displayOrder: 1 },
    ],
  },
  {
    slug: "vale-forever-sun-clustered-zip-up-yellow",
    name: "Vale Forever Sun Clustered Zip Up 'Yellow'",
    brand: "Vale Forever",
    description:
      "The Vale Forever Sun Clustered Zip Up in Yellow. Bold colour, clean lines. A standout piece from the Vale Forever collection.",
    price: 250,
    category: "Tops",
    status: "ACTIVE" as const,
    sizes: ["M"],
    images: [
      { url: "/products/valesun.jpg", displayOrder: 0 },
      { url: "/products/valesunback.jpg", displayOrder: 1 },
    ],
  },
];

async function main() {
  console.log("Seeding database...\n");

  for (const product of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (existing) {
      console.log(`  ⚠  Skipped (already exists): ${product.name}`);
      continue;
    }

    const created = await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        category: product.category,
        status: product.status,
        sizes: product.sizes,
        quantity: product.sizes.length,
        images: { create: product.images },
        sizeStocks: {
          create: product.sizes.map((size) => ({
            size,
            quantity: 1,
          })),
        },
      },
    });

    console.log(`  ✓  Created: ${created.name}`);
  }

  await prisma.$disconnect();
  console.log("\nDone. Visit http://localhost:3000 to see your store.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
