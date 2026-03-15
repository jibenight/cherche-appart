"use client";

import type { PropertyCard } from "@/types/property";
import { ComparisonMetric } from "./ComparisonMetric";

interface ComparisonTableProps {
  properties: PropertyCard[];
}

interface Metric {
  label: string;
  values: string[];
  rawValues: number[];
  bestFn: "min" | "max";
}

function getBestIndex(values: number[], fn: "min" | "max"): number | null {
  if (values.length === 0) return null;
  const best = fn === "min" ? Math.min(...values) : Math.max(...values);
  return values.indexOf(best);
}

/** Side-by-side comparison grid */
export function ComparisonTable({ properties }: ComparisonTableProps) {
  const metrics: Metric[] = [
    {
      label: "Prix",
      values: properties.map((p) => `${p.price.toLocaleString("fr-FR")} €`),
      rawValues: properties.map((p) => p.price),
      bestFn: "min",
    },
    {
      label: "Surface",
      values: properties.map((p) => `${p.surface} m²`),
      rawValues: properties.map((p) => p.surface),
      bestFn: "max",
    },
    {
      label: "Prix/m²",
      values: properties.map(
        (p) => `${p.pricePerM2.toLocaleString("fr-FR")} €/m²`,
      ),
      rawValues: properties.map((p) => p.pricePerM2),
      bestFn: "min",
    },
    {
      label: "Pièces",
      values: properties.map((p) => String(p.rooms)),
      rawValues: properties.map((p) => p.rooms),
      bestFn: "max",
    },
    {
      label: "Chambres",
      values: properties.map((p) => String(p.bedrooms)),
      rawValues: properties.map((p) => p.bedrooms),
      bestFn: "max",
    },
    {
      label: "DPE",
      values: properties.map((p) => p.dpe),
      rawValues: properties.map((p) => {
        const order = ["A", "B", "C", "D", "E", "F", "G"];
        const idx = order.indexOf(p.dpe);
        return idx === -1 ? 99 : idx;
      }),
      bestFn: "min",
    },
    {
      label: "Ville",
      values: properties.map((p) => `${p.city} (${p.postcode})`),
      rawValues: properties.map(() => 0),
      bestFn: "min",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="bg-slate-50/80 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Critère
            </th>
            {properties.map((p) => (
              <th key={p.id} className="px-5 py-4 text-center">
                <div className="text-sm font-semibold text-slate-800 line-clamp-1">
                  {p.title}
                </div>
                {p.images.length > 0 && (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="mx-auto mt-2.5 h-16 w-24 rounded-lg object-cover shadow-sm"
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <ComparisonMetric
              key={metric.label}
              label={metric.label}
              values={metric.values}
              bestIndex={
                metric.label === "Ville"
                  ? null
                  : getBestIndex(metric.rawValues, metric.bestFn)
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
