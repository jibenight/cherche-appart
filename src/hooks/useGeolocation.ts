"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  /** Current status of the geolocation request */
  status: "idle" | "loading" | "success" | "error";
  /** Latitude if successful */
  lat: number | null;
  /** Longitude if successful */
  lng: number | null;
  /** Error message if failed */
  error: string | null;
}

interface UseGeolocationReturn extends GeolocationState {
  /** Request the user's location */
  requestLocation: () => void;
  /** Cancel ongoing request */
  cancel: () => void;
}

// France approximate bounding box
const FRANCE_BOUNDS = {
  minLat: 41.3,
  maxLat: 51.1,
  minLng: -5.2,
  maxLng: 9.6,
};

function isInFrance(lat: number, lng: number): boolean {
  return (
    lat >= FRANCE_BOUNDS.minLat &&
    lat <= FRANCE_BOUNDS.maxLat &&
    lng >= FRANCE_BOUNDS.minLng &&
    lng <= FRANCE_BOUNDS.maxLng
  );
}

/**
 * Hook for accessing browser geolocation with error handling.
 * Includes France boundary check and timeout management.
 */
export function useGeolocation(timeoutMs: number = 5000): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    lat: null,
    lng: null,
    error: null,
  });

  const [watchId, setWatchId] = useState<number | null>(null);

  const cancel = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setState((prev) => ({
      ...prev,
      status: prev.status === "loading" ? "idle" : prev.status,
    }));
  }, [watchId]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        status: "error",
        lat: null,
        lng: null,
        error: "La géolocalisation n'est pas supportée par votre navigateur.",
      });
      return;
    }

    setState({ status: "loading", lat: null, lng: null, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!isInFrance(latitude, longitude)) {
          setState({
            status: "error",
            lat: null,
            lng: null,
            error:
              "Votre position semble être en dehors de la France. Cette application couvre uniquement la France métropolitaine.",
          });
          return;
        }

        setState({
          status: "success",
          lat: latitude,
          lng: longitude,
          error: null,
        });
      },
      (error) => {
        let message: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "L'accès à votre position a été refusé. Veuillez saisir une ville manuellement.";
            break;
          case error.POSITION_UNAVAILABLE:
            message =
              "Impossible de déterminer votre position. Veuillez saisir une ville manuellement.";
            break;
          case error.TIMEOUT:
            message =
              "La demande de géolocalisation a expiré. Veuillez réessayer ou saisir une ville manuellement.";
            break;
          default:
            message =
              "Une erreur est survenue lors de la géolocalisation. Veuillez saisir une ville manuellement.";
        }
        setState({
          status: "error",
          lat: null,
          lng: null,
          error: message,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: timeoutMs,
        maximumAge: 60000, // Accept cached position up to 1 minute old
      },
    );
  }, [timeoutMs]);

  return { ...state, requestLocation, cancel };
}
