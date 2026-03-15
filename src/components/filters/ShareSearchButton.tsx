"use client";

import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";
import { useSearchStore } from "@/store/searchStore";
import { filtersToSearchParams } from "@/services/filterService";

/** Button that copies current search URL to clipboard */
export function ShareSearchButton() {
  const [copied, setCopied] = useState(false);
  const filters = useFilterStore((s) => s.filters);
  const location = useSearchStore((s) => s.location);
  const radiusKm = useSearchStore((s) => s.radiusKm);

  const handleShare = async () => {
    const params = filtersToSearchParams(filters);
    if (location) {
      params.set("city", location.name);
      params.set("lat", String(location.lat));
      params.set("lng", String(location.lng));
      params.set("r", String(radiusKm));
    }

    const url = `${window.location.origin}/?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select a temporary input
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
        copied
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm"
      }`}
      title="Copier le lien de recherche"
    >
      {copied ? (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
      {copied ? "Copié !" : "Partager"}
    </button>
  );
}
