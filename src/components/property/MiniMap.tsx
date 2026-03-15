"use client";

import dynamic from "next/dynamic";

const MiniMapInner = dynamic(() => import("./MiniMapInner"), { ssr: false });

interface MiniMapProps {
  lat: number;
  lng: number;
  city: string;
}

/** Small Leaflet map showing property location on detail page */
export function MiniMap(props: MiniMapProps) {
  return (
    <div className="h-48 w-full overflow-hidden rounded-lg">
      <MiniMapInner {...props} />
    </div>
  );
}
