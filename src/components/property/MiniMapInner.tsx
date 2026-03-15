"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MiniMapInnerProps {
  lat: number;
  lng: number;
  city: string;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MiniMapInner({ lat, lng, city }: MiniMapInnerProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={markerIcon} title={city} />
    </MapContainer>
  );
}
