"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState } from "react";

export type WtfImageRow = { id: string; url: string; displayOrder: number };

function imgUnoptimized(url: string) {
  return (
    url.startsWith("/api/") ||
    url.startsWith("/products/") ||
    url.startsWith("/wtf/") ||
    url.startsWith("/submissions/")
  );
}

export default function WtfImageManager({
  initialImages,
}: {
  initialImages: WtfImageRow[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const images = [...initialImages].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  async function uploadFiles(files: File[]) {
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "wtf");

        const up = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const upData = await up.json().catch(() => ({}));
        if (!up.ok) {
          setUploadError(
            upData.error ??
              (up.status === 401
                ? "Session expired — sign in again"
                : `Upload failed (${up.status})`)
          );
          continue;
        }
        if (!upData.url) continue;

        const create = await fetch("/api/admin/wtf-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ url: upData.url }),
        });
        if (!create.ok) {
          const c = await create.json().catch(() => ({}));
          setUploadError(c.error ?? "Could not save image record");
        }
      }
      router.refresh();
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    setUploadError(null);
    try {
      const res = await fetch(`/api/admin/wtf-images?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setUploadError(d.error ?? "Delete failed");
        return;
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function reorder(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    const orderedIds = next.map((i) => i.id);

    setBusyId("reorder");
    setUploadError(null);
    try {
      const res = await fetch("/api/admin/wtf-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setUploadError(d.error ?? "Reorder failed");
        return;
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(Array.from(e.dataTransfer.files));
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded cursor-pointer transition-colors flex flex-col items-center justify-center py-10 ${
          dragOver
            ? "border-black bg-neutral-100"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            uploadFiles(files);
            e.target.value = "";
          }}
        />
        {uploading ? (
          <p className="text-[12px] text-neutral-500">Uploading...</p>
        ) : (
          <>
            <p className="text-[13px] font-medium">Drop photos here or click to upload</p>
            <p className="text-[11px] text-neutral-400 mt-1">
              JPG, PNG, WEBP — multiple files supported
            </p>
          </>
        )}
      </div>

      {uploadError && (
        <p className="mt-3 text-[11px] text-red-600 uppercase tracking-widest">
          {uploadError}
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group">
              <div className="relative aspect-square bg-neutral-200 overflow-hidden rounded">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized={imgUnoptimized(img.url)}
                />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                {idx > 0 && (
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={(e) => {
                      e.stopPropagation();
                      reorder(idx, idx - 1);
                    }}
                    className="w-6 h-6 bg-white text-black text-[11px] flex items-center justify-center rounded disabled:opacity-50"
                    title="Earlier"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(img.id);
                  }}
                  className="w-6 h-6 bg-white text-red-500 text-[11px] flex items-center justify-center rounded disabled:opacity-50"
                  title="Remove"
                >
                  ×
                </button>
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={(e) => {
                      e.stopPropagation();
                      reorder(idx, idx + 1);
                    }}
                    className="w-6 h-6 bg-white text-black text-[11px] flex items-center justify-center rounded disabled:opacity-50"
                    title="Later"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
