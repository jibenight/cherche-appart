import { describe, it, expect, beforeEach } from "vitest";
import {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  toggleAlert,
} from "@/services/alertsService";
import { DEFAULT_FILTERS } from "@/types/filters";
import type { SearchAlert } from "@/types/alerts";
import type { Location } from "@/types/location";

const mockLocation: Location = {
  name: "Lyon",
  postcode: "69000",
  department: "Rhone",
  lat: 45.76,
  lng: 4.84,
};

const baseAlert: Omit<SearchAlert, "id" | "createdAt" | "lastTriggered"> = {
  name: "Lyon centre",
  filters: DEFAULT_FILTERS,
  location: mockLocation,
  radiusKm: 5,
  frequency: "daily",
  isActive: true,
};

beforeEach(() => {
  window.localStorage.clear();
});

describe("alertsService", () => {
  describe("createAlert", () => {
    it("creates an alert and returns it with generated id and createdAt", () => {
      const result = createAlert(baseAlert);
      expect(result).not.toBeNull();
      expect(result!.id).toBeDefined();
      expect(result!.name).toBe("Lyon centre");
      expect(result!.createdAt).toBeDefined();
      expect(result!.lastTriggered).toBeNull();
      expect(result!.isActive).toBe(true);
    });

    it("persists the alert to localStorage", () => {
      createAlert(baseAlert);
      const raw = window.localStorage.getItem("cherche-appart-alerts");
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe("Lyon centre");
    });
  });

  describe("getAlerts", () => {
    it("returns empty array when no alerts exist", () => {
      expect(getAlerts()).toEqual([]);
    });

    it("returns all created alerts", () => {
      createAlert(baseAlert);
      createAlert({ ...baseAlert, name: "Paris search" });
      const alerts = getAlerts();
      expect(alerts).toHaveLength(2);
    });

    it("returns most recently created alert first", () => {
      createAlert({ ...baseAlert, name: "First" });
      createAlert({ ...baseAlert, name: "Second" });
      const alerts = getAlerts();
      expect(alerts[0].name).toBe("Second");
      expect(alerts[1].name).toBe("First");
    });
  });

  describe("toggleAlert", () => {
    it("flips isActive from true to false", () => {
      const created = createAlert(baseAlert)!;
      expect(created.isActive).toBe(true);

      const toggled = toggleAlert(created.id);
      expect(toggled).not.toBeNull();
      expect(toggled!.isActive).toBe(false);
    });

    it("flips isActive from false to true", () => {
      const created = createAlert({ ...baseAlert, isActive: false })!;
      expect(created.isActive).toBe(false);

      const toggled = toggleAlert(created.id);
      expect(toggled).not.toBeNull();
      expect(toggled!.isActive).toBe(true);
    });

    it("returns null for non-existent id", () => {
      const result = toggleAlert("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("deleteAlert", () => {
    it("removes the alert and returns true", () => {
      const created = createAlert(baseAlert)!;
      const deleted = deleteAlert(created.id);
      expect(deleted).toBe(true);
      expect(getAlerts()).toHaveLength(0);
    });

    it("returns false for non-existent id", () => {
      const result = deleteAlert("non-existent-id");
      expect(result).toBe(false);
    });

    it("only removes the targeted alert", () => {
      const first = createAlert({ ...baseAlert, name: "First" })!;
      createAlert({ ...baseAlert, name: "Second" });
      deleteAlert(first.id);

      const remaining = getAlerts();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].name).toBe("Second");
    });
  });

  describe("max limit enforcement", () => {
    it("returns null when creating alert at max capacity (10)", () => {
      for (let i = 0; i < 10; i++) {
        const result = createAlert({ ...baseAlert, name: `Alert ${i}` });
        expect(result).not.toBeNull();
      }
      expect(getAlerts()).toHaveLength(10);

      const overflow = createAlert({ ...baseAlert, name: "Overflow" });
      expect(overflow).toBeNull();
      expect(getAlerts()).toHaveLength(10);
    });

    it("allows creating after deleting one at max capacity", () => {
      for (let i = 0; i < 10; i++) {
        createAlert({ ...baseAlert, name: `Alert ${i}` });
      }
      const alerts = getAlerts();
      deleteAlert(alerts[0].id);

      const newAlert = createAlert({ ...baseAlert, name: "New alert" });
      expect(newAlert).not.toBeNull();
      expect(getAlerts()).toHaveLength(10);
    });
  });

  describe("updateAlert", () => {
    it("updates the alert name", () => {
      const created = createAlert(baseAlert)!;
      const updated = updateAlert(created.id, { name: "Renamed alert" });
      expect(updated).not.toBeNull();
      expect(updated!.name).toBe("Renamed alert");

      const alerts = getAlerts();
      expect(alerts.find((a) => a.id === created.id)!.name).toBe("Renamed alert");
    });

    it("updates the alert frequency", () => {
      const created = createAlert(baseAlert)!;
      const updated = updateAlert(created.id, { frequency: "weekly" });
      expect(updated).not.toBeNull();
      expect(updated!.frequency).toBe("weekly");
    });

    it("returns null for non-existent id", () => {
      const result = updateAlert("non-existent-id", { name: "Nope" });
      expect(result).toBeNull();
    });

    it("preserves other fields when updating partially", () => {
      const created = createAlert(baseAlert)!;
      updateAlert(created.id, { name: "New name" });

      const alert = getAlerts().find((a) => a.id === created.id)!;
      expect(alert.name).toBe("New name");
      expect(alert.frequency).toBe("daily");
      expect(alert.isActive).toBe(true);
      expect(alert.location.name).toBe("Lyon");
    });
  });
});
