"use client";

import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { PropertyCard } from "@/types/property";

interface PropertyMarkersProps {
  properties: PropertyCard[];
  highlightedId: string | null;
  onMarkerHover: (id: string | null) => void;
  onMarkerClick: (id: string) => void;
}

/** Create a custom DivIcon with price label */
function createPriceIcon(price: number, isHighlighted: boolean): L.DivIcon {
  const label = formatPrice(price);
  return L.divIcon({
    className: "custom-price-marker",
    html: `<div style="
      background: ${isHighlighted ? "#1d4ed8" : "#ffffff"};
      color: ${isHighlighted ? "#ffffff" : "#1e40af"};
      border: 2px solid ${isHighlighted ? "#1d4ed8" : "#3b82f6"};
      border-radius: 20px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      transition: all 0.15s;
      text-align: center;
    ">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M €`;
  if (price >= 1_000) return `${Math.round(price / 1_000)}k €`;
  return `${price} €`;
}

/** Marker cluster layer using leaflet.markercluster */
function MarkerClusterLayer({
  properties,
  highlightedId,
  onMarkerHover,
  onMarkerClick,
}: PropertyMarkersProps) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove previous cluster group
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = "small";
        if (count >= 100) size = "large";
        else if (count >= 10) size = "medium";
        return L.divIcon({
          html: `<div style="
            background: #3b82f6;
            color: white;
            border: 3px solid white;
            border-radius: 50%;
            width: ${size === "large" ? 50 : size === "medium" ? 40 : 34}px;
            height: ${size === "large" ? 50 : size === "medium" ? 40 : 34}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${size === "large" ? 14 : 12}px;
            font-weight: 700;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">${count}</div>`,
          className: "marker-cluster-custom",
          iconSize: L.point(
            size === "large" ? 50 : size === "medium" ? 40 : 34,
            size === "large" ? 50 : size === "medium" ? 40 : 34,
          ),
        });
      },
    });

    properties.forEach((property) => {
      const isHighlighted = property.id === highlightedId;
      const marker = L.marker([property.lat, property.lng], {
        icon: createPriceIcon(property.price, isHighlighted),
      });

      marker.on("mouseover", () => onMarkerHover(property.id));
      marker.on("mouseout", () => onMarkerHover(null));
      marker.on("click", () => onMarkerClick(property.id));

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <p style="font-weight: 600; font-size: 13px; margin: 0;">${property.title}</p>
          <p style="color: #2563eb; font-weight: 700; margin: 4px 0;">${formatPrice(property.price)}</p>
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            ${property.surface}m² • ${property.rooms}p • ${property.city}
          </p>
        </div>
      `);

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
    };
  }, [map, properties, highlightedId, onMarkerHover, onMarkerClick]);

  return null;
}

/** Fallback for small datasets without clustering */
function SimpleMarkers({
  properties,
  highlightedId,
  onMarkerHover,
  onMarkerClick,
}: PropertyMarkersProps) {
  return (
    <>
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.lat, property.lng]}
          icon={createPriceIcon(property.price, property.id === highlightedId)}
          eventHandlers={{
            mouseover: () => onMarkerHover(property.id),
            mouseout: () => onMarkerHover(null),
            click: () => onMarkerClick(property.id),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <p className="text-sm font-semibold">{property.title}</p>
              <p className="font-bold text-blue-600">
                {formatPrice(property.price)}
              </p>
              <p className="text-xs text-gray-500">
                {property.surface}m² • {property.rooms}p • {property.city}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

/** Use clustering for large datasets, simple markers for small ones */
const CLUSTER_THRESHOLD = 30;

export function PropertyMarkers(props: PropertyMarkersProps) {
  if (props.properties.length > CLUSTER_THRESHOLD) {
    return <MarkerClusterLayer {...props} />;
  }
  return <SimpleMarkers {...props} />;
}
