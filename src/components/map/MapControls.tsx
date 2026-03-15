"use client";

import { useMap } from "react-leaflet";

/** Map zoom controls + fullscreen toggle */
export function MapControls() {
  const map = useMap();

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control flex flex-col gap-1 rounded-lg bg-white p-1 shadow-md">
        <button
          onClick={() => map.zoomIn()}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          aria-label="Zoom avant"
          title="Zoom avant"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          aria-label="Zoom arrière"
          title="Zoom arrière"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <div className="border-t border-gray-200" />
        <button
          onClick={() => map.setView([46.603354, 1.888334], 6)}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          aria-label="Recentrer sur la France"
          title="Recentrer sur la France"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
