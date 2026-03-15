import type { SearchAlert } from "@/types/alerts";

const STORAGE_KEY = "cherche-appart-alerts";
const MAX_ALERTS = 10;

function loadAlerts(): SearchAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SearchAlert[]) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: SearchAlert[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // Storage full
  }
}

export function getAlerts(): SearchAlert[] {
  return loadAlerts();
}

export function createAlert(
  alert: Omit<SearchAlert, "id" | "createdAt" | "lastTriggered">,
): SearchAlert | null {
  const alerts = loadAlerts();
  if (alerts.length >= MAX_ALERTS) return null;

  const newAlert: SearchAlert = {
    ...alert,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    lastTriggered: null,
  };

  saveAlerts([newAlert, ...alerts]);
  return newAlert;
}

export function updateAlert(
  id: string,
  updates: Partial<Pick<SearchAlert, "name" | "frequency" | "isActive">>,
): SearchAlert | null {
  const alerts = loadAlerts();
  const index = alerts.findIndex((a) => a.id === id);
  if (index === -1) return null;

  alerts[index] = { ...alerts[index], ...updates };
  saveAlerts(alerts);
  return alerts[index];
}

export function deleteAlert(id: string): boolean {
  const alerts = loadAlerts();
  const filtered = alerts.filter((a) => a.id !== id);
  if (filtered.length === alerts.length) return false;
  saveAlerts(filtered);
  return true;
}

export function toggleAlert(id: string): SearchAlert | null {
  const alerts = loadAlerts();
  const alert = alerts.find((a) => a.id === id);
  if (!alert) return null;
  return updateAlert(id, { isActive: !alert.isActive });
}
