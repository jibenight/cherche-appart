"use client";

interface EnergyRatingProps {
  label: string;
  rating: string;
  value?: number | null;
  unit: string;
}

const RATING_COLORS: Record<string, string> = {
  A: "bg-green-600",
  B: "bg-green-400",
  C: "bg-yellow-400",
  D: "bg-yellow-500",
  E: "bg-orange-500",
  F: "bg-red-500",
  G: "bg-red-700",
};

const RATING_WIDTHS: Record<string, string> = {
  A: "w-3/12",
  B: "w-4/12",
  C: "w-5/12",
  D: "w-6/12",
  E: "w-8/12",
  F: "w-10/12",
  G: "w-full",
};

/** DPE/GES energy rating colored scale display */
export function EnergyRating({ label, rating, value, unit }: EnergyRatingProps) {
  const color = RATING_COLORS[rating] ?? "bg-gray-300";
  const width = RATING_WIDTHS[rating] ?? "w-full";
  const isUnknown = rating === "unknown" || !rating;

  return (
    <div>
      <p className="mb-1 text-xs font-medium text-gray-600">{label}</p>
      {isUnknown ? (
        <p className="text-sm text-gray-400">Non renseigné</p>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-6 w-full rounded-full bg-gray-100">
              <div
                className={`flex h-6 items-center justify-end rounded-full ${color} ${width} px-2 transition-all`}
              >
                <span className="text-xs font-bold text-white">{rating}</span>
              </div>
            </div>
          </div>
          {value !== null && value !== undefined && (
            <span className="whitespace-nowrap text-xs text-gray-500">
              {value} {unit}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
