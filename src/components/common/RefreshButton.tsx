"use client";

import React, { useState } from "react";
import { RefreshCw, Check } from "lucide-react";

interface RefreshButtonProps {
  onRefresh?: () => Promise<void> | void;
  className?: string;
}

export function RefreshButton({ onRefresh, className }: RefreshButtonProps) {
  const [loading, setLoading] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setJustRefreshed(false);

    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // Fallback default revalidation trigger
        await new Promise((resolve) => setTimeout(resolve, 800));
        window.location.reload();
      }
      setJustRefreshed(true);
      setTimeout(() => setJustRefreshed(false), 2000);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition-colors shadow-2xs ${className || ""}`}
      title="Periksa pembaruan data dan refresh cache"
    >
      {justRefreshed ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? "animate-spin text-sky-600" : ""}`} />
      )}
      <span>{loading ? "Memperbarui..." : justRefreshed ? "Terkini" : "Refresh Data"}</span>
    </button>
  );
}
