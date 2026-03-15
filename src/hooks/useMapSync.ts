import { useCallback } from "react";
import { useMapStore } from "@/store/mapStore";

/** Bidirectional sync hook between map markers and list items */
export function useMapSync() {
  const hoveredPropertyId = useMapStore((s) => s.hoveredPropertyId);
  const selectedPropertyId = useMapStore((s) => s.selectedPropertyId);
  const setHoveredPropertyId = useMapStore((s) => s.setHoveredPropertyId);
  const setSelectedPropertyId = useMapStore((s) => s.setSelectedPropertyId);

  const handlePropertyHover = useCallback(
    (id: string | null) => {
      setHoveredPropertyId(id);
    },
    [setHoveredPropertyId],
  );

  const handlePropertyClick = useCallback(
    (id: string) => {
      setSelectedPropertyId(id);
    },
    [setSelectedPropertyId],
  );

  return {
    hoveredPropertyId,
    selectedPropertyId,
    handlePropertyHover,
    handlePropertyClick,
  };
}
