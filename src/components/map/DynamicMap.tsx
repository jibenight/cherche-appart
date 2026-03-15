"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const MapContainerDynamic = dynamic(
  () => import("./MapContainer").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-lg bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          <span className="text-sm text-gray-500">Chargement de la carte...</span>
        </div>
      </div>
    ),
  },
);

interface DynamicMapProps {
  children?: ReactNode;
}

export function DynamicMap({ children }: DynamicMapProps) {
  return <MapContainerDynamic>{children}</MapContainerDynamic>;
}
