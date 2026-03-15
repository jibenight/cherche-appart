"use client";

import type { PropertyCard } from "@/types/property";

interface MarkerPopupProps {
  property: PropertyCard;
  onViewDetails?: (id: string) => void;
}

/** Popup card shown when clicking a property marker */
export function MarkerPopup({ property, onViewDetails }: MarkerPopupProps) {
  return (
    <div className="w-56">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t bg-gray-100">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-sm font-bold text-blue-600">
          {property.price.toLocaleString("fr-FR")} €
        </p>
        <div className="mt-0.5 flex gap-2 text-xs text-gray-500">
          <span>{property.surface} m²</span>
          <span>•</span>
          <span>{property.rooms} p.</span>
        </div>
        <p className="mt-0.5 text-xs text-gray-400">{property.city}</p>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(property.id)}
            className="mt-2 w-full rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            Voir le détail
          </button>
        )}
      </div>
    </div>
  );
}
