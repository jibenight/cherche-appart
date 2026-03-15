"use client";

import type { Property } from "@/types/property";
import { PhotoGallery } from "./PhotoGallery";
import { PropertyCharacteristics } from "./PropertyCharacteristics";
import { EnergyRating } from "./EnergyRating";
import { MiniMap } from "./MiniMap";

interface PropertyDetailProps {
  property: Property;
  onBack?: () => void;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

/** Full property detail layout */
export function PropertyDetail({
  property,
  onBack,
  isFavorited,
  onToggleFavorite,
}: PropertyDetailProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">{property.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {property.address} — {property.city} ({property.postcode})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`rounded-full p-2 transition-colors ${
                isFavorited
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
              aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <svg
                className="h-5 w-5"
                fill={isFavorited ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
          <p className="text-2xl font-bold text-blue-600">
            {property.price.toLocaleString("fr-FR")} €
          </p>
        </div>
      </div>

      {/* Photo gallery */}
      <PhotoGallery images={property.images} title={property.title} />

      {/* Info grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Left: Description + Characteristics */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Description
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {property.description || "Aucune description disponible."}
            </p>
          </div>

          <PropertyCharacteristics property={property} />
        </div>

        {/* Right: Energy + Map */}
        <div className="space-y-6">
          {/* Energy ratings */}
          <div className="space-y-3">
            <EnergyRating
              label="DPE - Consommation énergétique"
              rating={property.dpe}
              unit="kWh/m²/an"
            />
          </div>

          {/* Map */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Localisation
            </h3>
            <MiniMap
              lat={property.lat}
              lng={property.lng}
              city={property.city}
            />
          </div>

          {/* Source */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Source : {property.source}
            </p>
            {property.externalUrl && (
              <a
                href={property.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs text-blue-600 hover:underline"
              >
                Voir l&apos;annonce originale
              </a>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Publié le{" "}
              {new Date(property.publishedAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
