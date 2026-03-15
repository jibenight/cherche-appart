"use client";

import type { Property } from "@/types/property";

interface PropertyCharacteristicsProps {
  property: Property;
}

/** Property attributes table */
export function PropertyCharacteristics({
  property,
}: PropertyCharacteristicsProps) {
  const characteristics = [
    { label: "Type", value: formatPropertyType(property.type) },
    { label: "Surface", value: `${property.surface} m²` },
    { label: "Pièces", value: String(property.rooms) },
    { label: "Chambres", value: String(property.bedrooms) },
    {
      label: "Étage",
      value:
        property.floor !== null
          ? property.floor === 0
            ? "RDC"
            : `${property.floor}${property.totalFloors ? `/${property.totalFloors}` : ""}`
          : null,
    },
    { label: "Parking", value: property.hasParking ? "Oui" : "Non" },
    { label: "Ascenseur", value: property.hasElevator ? "Oui" : "Non" },
    { label: "Balcon/Terrasse", value: property.hasBalcony ? "Oui" : "Non" },
    { label: "État", value: formatCondition(property.condition) },
    {
      label: "Prix/m²",
      value: `${property.pricePerM2.toLocaleString("fr-FR")} €`,
    },
  ].filter((c) => c.value !== null);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Caractéristiques
      </h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        {characteristics.map((c) => (
          <div key={c.label} className="flex justify-between">
            <dt className="text-xs text-gray-500">{c.label}</dt>
            <dd className="text-xs font-medium text-gray-900">{c.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function formatPropertyType(type: string): string {
  const map: Record<string, string> = {
    apartment: "Appartement",
    house: "Maison",
    studio: "Studio",
    loft: "Loft",
    land: "Terrain",
    commercial: "Commerce",
    other: "Autre",
  };
  return map[type] ?? type;
}

function formatCondition(condition: string): string {
  const map: Record<string, string> = {
    new: "Neuf",
    good: "Bon état",
    to_renovate: "À rénover",
  };
  return map[condition] ?? condition;
}
