import { useCallback } from "react";
import { useMapStore } from "@/store/mapStore";
import type { MapViewport } from "@/types/map";

/** Track current map bounds and viewport changes */
export function useMapViewport() {
  const viewport = useMapStore((s) => s.viewport);
  const setViewport = useMapStore((s) => s.setViewport);
  const searchAsIMove = useMapStore((s) => s.searchAsIMove);

  const handleViewportChange = useCallback(
    (newViewport: MapViewport) => {
      setViewport(newViewport);
    },
    [setViewport],
  );

  return {
    viewport,
    searchAsIMove,
    handleViewportChange,
  };
}
