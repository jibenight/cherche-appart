"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { MapSkeleton } from "./MapSkeleton";

const MapContainerDynamic = dynamic(
  () => import("./MapContainer").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  },
);

interface DynamicMapProps {
  children?: ReactNode;
}

export function DynamicMap({ children }: DynamicMapProps) {
  return <MapContainerDynamic>{children}</MapContainerDynamic>;
}
