"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types";

interface AdminProductTableProps {
  products: (Product & { images: { id: string; url: string; displayOrder: number }[] })[];
}

type StatusMap = Record<string, string>;

export default function AdminProductTable({
  products,
}: AdminProductTableProps) {
  const router = useRouter();
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  // Optimistic local status per product id
  const [statusMap, setStatusMap] = useState<StatusMap>(() =>
    Object.fromEntries(products.map((p) => [p.id, p.status]))
  );

  async function handleArchive(id: string, name: string) {
    if (!confirm(`Archive "${name}"? It will be hidden from the store but not deleted.`)) return;
    setArchivingId(id);
    setStatusMap((prev) => ({ ...prev, [id]: "ARCHIVED" }));
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ARCHIVED" }),
    });
    setArchivingId(null);
    if (!res.ok) {
      setStatusMap((prev) => ({ ...prev, [id]: products.find((p) => p.id === id)?.status ?? "DRAFT" }));
    }
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    const previous = statusMap[id];
    setStatusMap((prev) => ({ ...prev, [id]: status }));
    setSavingId(id);
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSavingId(null);
    if (!res.ok) {
      setStatusMap((prev) => ({ ...prev, [id]: previous }));
    }
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
                  <div className="flex items-center gap-1.5">
                    <select
                      value={statusMap[product.id] ?? product.status}
                      disabled={savingId === product.id}
                      onChange={(e) =>
                        handleStatusChange(product.id, e.target.value)
                      }
                      className={`text-[10px] uppercase tracking-widest px-2 py-1 border focus:outline-none disabled:opacity-60 ${
                        (statusMap[product.id] ?? product.status) === "ACTIVE"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : (statusMap[product.id] ?? product.status) === "SOLD"
                          ? "border-neutral-300 bg-neutral-100 text-neutral-500"
                          : (statusMap[product.id] ?? product.status) === "ARCHIVED"
                          ? "border-neutral-300 bg-neutral-200 text-neutral-400"
                          : "border-yellow-300 bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="ACTIVE">Active</option>
                      <option value="SOLD">Sold</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                    {savingId === product.id && (
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest">saving…</span>
                    )}
                  </div>
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
                    {(statusMap[product.id] ?? product.status) !== "ARCHIVED" && (
                      <button
                        onClick={() => handleArchive(product.id, product.name)}
                        disabled={archivingId === product.id}
                        className="text-[11px] uppercase tracking-widest text-neutral-400 hover:text-black disabled:opacity-50"
                      >
                        {archivingId === product.id ? "..." : "Archive"}
                      </button>
                    )}
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
