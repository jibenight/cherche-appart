"use client";

import type { PropertyCard } from "@/types/property";

interface PropertyCardComponentProps {
  property: PropertyCard;
  isHighlighted?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: (id: string) => void;
}

/** Formats a price with French locale formatting */
function formatPriceDisplay(price: number): string {
  return price.toLocaleString("fr-FR") + " €";
}

/** DPE badge color mapping */
const DPE_COLORS: Record<string, string> = {
  A: "bg-emerald-500 text-white",
  B: "bg-emerald-400 text-white",
  C: "bg-yellow-400 text-slate-800",
  D: "bg-amber-400 text-slate-800",
  E: "bg-orange-500 text-white",
  F: "bg-red-500 text-white",
  G: "bg-red-700 text-white",
  unknown: "bg-slate-200 text-slate-500",
};

export function PropertyCardComponent({
  property,
  isHighlighted = false,
  onHover,
  onClick,
}: PropertyCardComponentProps) {
  return (
    <article
      className={`group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200 ${
        isHighlighted
          ? "border-brand-400 shadow-glow ring-1 ring-brand-400/30"
          : "border-slate-200/60 shadow-card hover:border-slate-300 hover:shadow-card-hover"
      }`}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(property.id)}
      role="button"
      tabIndex={0}
      aria-label={`${property.title} - ${formatPriceDisplay(property.price)} - ${property.surface}m²`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
            <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* DPE Badge */}
        <span className={`absolute bottom-2.5 right-2.5 rounded-lg px-2 py-1 text-[11px] font-bold tracking-wide shadow-sm ${DPE_COLORS[property.dpe] ?? DPE_COLORS.unknown}`}>
          DPE {property.dpe === "unknown" ? "?" : property.dpe}
        </span>

        {/* Transaction type badge */}
        <span className="absolute left-2.5 top-2.5 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
          {property.transactionType === "rent" ? "Location" : "Vente"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-brand-700">
          {property.title}
        </h3>

        <p className="mt-1.5 text-lg font-bold text-brand-600">
          {formatPriceDisplay(property.price)}
          {property.transactionType === "rent" && (
            <span className="text-sm font-medium text-slate-400">/mois</span>
          )}
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.surface} m²
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{property.rooms} pièce{property.rooms > 1 ? "s" : ""}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{property.bedrooms} ch.</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.city} ({property.postcode})
          </p>
          <p className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
            {property.pricePerM2.toLocaleString("fr-FR")} €/m²
          </p>
        </div>
      </div>
    </article>
  );
}
