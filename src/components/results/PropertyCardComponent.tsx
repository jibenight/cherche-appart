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
  A: "bg-green-600 text-white",
  B: "bg-green-400 text-white",
  C: "bg-yellow-400 text-gray-800",
  D: "bg-yellow-500 text-white",
  E: "bg-orange-500 text-white",
  F: "bg-red-500 text-white",
  G: "bg-red-700 text-white",
  unknown: "bg-gray-300 text-gray-600",
};

export function PropertyCardComponent({
  property,
  isHighlighted = false,
  onHover,
  onClick,
}: PropertyCardComponentProps) {
  return (
    <article
      className={`group cursor-pointer overflow-hidden rounded-lg border transition-all ${
        isHighlighted
          ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(property.id)}
      role="button"
      tabIndex={0}
      aria-label={`${property.title} - ${formatPriceDisplay(property.price)} - ${property.surface}m²`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* DPE Badge */}
        <span className={`absolute bottom-2 right-2 rounded px-2 py-0.5 text-xs font-bold ${DPE_COLORS[property.dpe] ?? DPE_COLORS.unknown}`}>
          DPE {property.dpe === "unknown" ? "?" : property.dpe}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
        </div>

        <p className="mt-1 text-lg font-bold text-blue-600">
          {formatPriceDisplay(property.price)}
        </p>

        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
          <span>{property.surface} m²</span>
          <span>•</span>
          <span>{property.rooms} pièce{property.rooms > 1 ? "s" : ""}</span>
          <span>•</span>
          <span>{property.bedrooms} ch.</span>
        </div>

        <p className="mt-1 text-xs text-gray-400">
          {property.city} ({property.postcode})
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          {property.pricePerM2.toLocaleString("fr-FR")} €/m²
        </p>
      </div>
    </article>
  );
}
