"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MapContainer as LeafletMapContainer, TileLayer, useMap } from "react-leaflet";
import { useSearchStore } from "@/store/searchStore";
import { SearchCircle } from "./SearchCircle";
import "leaflet/dist/leaflet.css";

/** Default map center: France center (approximate) */
const DEFAULT_CENTER: [number, number] = [46.603354, 1.888334];
const DEFAULT_ZOOM = 6;
const CITY_ZOOM = 12;

/** Component to recenter map when location changes */
function MapRecenter() {
  const map = useMap();
  const location = useSearchStore((s) => s.location);

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], CITY_ZOOM, {
        duration: 1,
      });
    } else {
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
        duration: 1,
      });
    }
  }, [location, map]);

  return null;
}

interface MapWrapperProps {
  children?: ReactNode;
}

function MapWrapper({ children }: MapWrapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mapRef}
      className="relative h-full w-full min-h-[300px] rounded-lg overflow-hidden"
    >
      <LeafletMapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter />
        <SearchCircle />
        {children}
      </LeafletMapContainer>
    </div>
  );
}

export { MapWrapper as MapContainer };
