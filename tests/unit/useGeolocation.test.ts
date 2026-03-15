import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGeolocation } from "@/hooks/useGeolocation";

// Mock navigator.geolocation
const mockGetCurrentPosition = vi.fn();
const mockClearWatch = vi.fn();

Object.defineProperty(global.navigator, "geolocation", {
  value: {
    getCurrentPosition: mockGetCurrentPosition,
    clearWatch: mockClearWatch,
    watchPosition: vi.fn(),
  },
  writable: true,
  configurable: true,
});

beforeEach(() => {
  mockGetCurrentPosition.mockReset();
  mockClearWatch.mockReset();
});

describe("useGeolocation", () => {
  it("starts in idle state", () => {
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.status).toBe("idle");
    expect(result.current.lat).toBeNull();
    expect(result.current.lng).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets loading state when requesting location", () => {
    mockGetCurrentPosition.mockImplementation(() => {
      // Don't call callback - simulate pending
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.status).toBe("loading");
  });

  it("sets coordinates on successful geolocation in France", () => {
    mockGetCurrentPosition.mockImplementation(
      (success: PositionCallback) => {
        success({
          coords: { latitude: 48.8566, longitude: 2.3522 }, // Paris
        } as GeolocationPosition);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.status).toBe("success");
    expect(result.current.lat).toBe(48.8566);
    expect(result.current.lng).toBe(2.3522);
    expect(result.current.error).toBeNull();
  });

  it("returns error for coordinates outside France", () => {
    mockGetCurrentPosition.mockImplementation(
      (success: PositionCallback) => {
        success({
          coords: { latitude: 40.7128, longitude: -74.006 }, // New York
        } as GeolocationPosition);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toContain("France");
  });

  it("handles permission denied error", () => {
    mockGetCurrentPosition.mockImplementation(
      (_: PositionCallback, error: PositionErrorCallback) => {
        error({
          code: 1,
          message: "User denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toContain("refusé");
  });

  it("handles timeout error", () => {
    mockGetCurrentPosition.mockImplementation(
      (_: PositionCallback, error: PositionErrorCallback) => {
        error({
          code: 3,
          message: "Timeout",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toContain("expiré");
  });
});
