"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
    >
      Sign Out
    </button>
  );
}
