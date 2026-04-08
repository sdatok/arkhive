"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types";

interface AdminProductTableProps {
  products: (Product & { images: { id: string; url: string; displayOrder: number }[] })[];
}

export default function AdminProductTable({
  products,
}: AdminProductTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded p-16 text-center">
        <p className="text-[12px] text-neutral-400 uppercase tracking-widest mb-4">
          No products yet
        </p>
        <Link
          href="/admin/products/new"
          className="text-[11px] uppercase tracking-widest underline"
        >
          Add your first product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-medium w-16">
              Image
            </th>
            <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
              Product
            </th>
            <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-medium hidden md:table-cell">
              Category
            </th>
            <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
              Price
            </th>
            <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
              Status
            </th>
            <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {products.map((product) => {
            const thumb = product.images[0];
            return (
              <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                {/* Thumbnail */}
                <td className="px-4 py-3">
                  <div className="relative w-12 h-14 bg-neutral-100">
                    {thumb ? (
                      <Image
                        src={thumb.url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                  </div>
                </td>

                {/* Name + brand */}
                <td className="px-4 py-3">
                  <p className="text-[12px] font-medium">{product.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {product.brand}
                  </p>
                </td>

                {/* Category */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-[12px] text-neutral-600">
                    {product.category}
                  </p>
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  <p className="text-[12px] font-medium">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <select
                    value={product.status}
                    onChange={(e) =>
                      handleStatusChange(product.id, e.target.value)
                    }
                    className={`text-[10px] uppercase tracking-widest px-2 py-1 border focus:outline-none ${
                      product.status === "ACTIVE"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : product.status === "SOLD"
                        ? "border-neutral-300 bg-neutral-100 text-neutral-500"
                        : "border-yellow-300 bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-[11px] uppercase tracking-widest hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="text-[11px] uppercase tracking-widest text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingId === product.id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
