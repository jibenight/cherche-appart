import { useState, useCallback } from "react";
import type { PropertyCard } from "@/types/property";

const MAX_COMPARE = 4;
const MIN_COMPARE = 2;

/** Hook for selecting properties to compare */
export function useComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds],
  );

  const canCompare = selectedIds.length >= MIN_COMPARE;
  const isFull = selectedIds.length >= MAX_COMPARE;

  /** Get comparison metrics for selected properties */
  const getMetrics = useCallback(
    (properties: PropertyCard[]) => {
      const selected = properties.filter((p) => selectedIds.includes(p.id));
      if (selected.length < MIN_COMPARE) return null;

      const metrics = [
        {
          label: "Prix",
          values: selected.map((p) => p.price),
          format: (v: number) => `${v.toLocaleString("fr-FR")} €`,
          bestFn: "min" as const,
        },
        {
          label: "Surface",
          values: selected.map((p) => p.surface),
          format: (v: number) => `${v} m²`,
          bestFn: "max" as const,
        },
        {
          label: "Prix/m²",
          values: selected.map((p) => p.pricePerM2),
          format: (v: number) => `${v.toLocaleString("fr-FR")} €/m²`,
          bestFn: "min" as const,
        },
        {
          label: "Pièces",
          values: selected.map((p) => p.rooms),
          format: (v: number) => `${v}`,
          bestFn: "max" as const,
        },
        {
          label: "Chambres",
          values: selected.map((p) => p.bedrooms),
          format: (v: number) => `${v}`,
          bestFn: "max" as const,
        },
        {
          label: "DPE",
          values: selected.map((p) => {
            const order = ["A", "B", "C", "D", "E", "F", "G"];
            return order.indexOf(p.dpe);
          }),
          format: (_v: number, idx: number) => selected[idx].dpe,
          bestFn: "min" as const,
        },
      ];

      return { properties: selected, metrics };
    },
    [selectedIds],
  );

  return {
    selectedIds,
    toggle,
    clear,
    isSelected,
    canCompare,
    isFull,
    getMetrics,
  };
}
