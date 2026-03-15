import { describe, it, expect, beforeEach } from "vitest";
import {
  getHistory,
  addToHistory,
  clearHistory,
  removeFromHistory,
} from "@/services/historyService";
import { DEFAULT_FILTERS } from "@/types/filters";
import type { SearchHistoryEntry } from "@/types/alerts";
import type { Location } from "@/types/location";

const mockLocation: Location = {
  name: "Lyon",
  postcode: "69000",
  department: "Rhone",
  lat: 45.76,
  lng: 4.84,
};

const baseEntry: Omit<SearchHistoryEntry, "id" | "searchedAt"> = {
  location: mockLocation,
  radiusKm: 5,
  filters: DEFAULT_FILTERS,
  resultCount: 42,
};

beforeEach(() => {
  window.localStorage.clear();
});

describe("historyService", () => {
  describe("addToHistory", () => {
    it("adds an entry and returns it with generated id and searchedAt", () => {
      const result = addToHistory(baseEntry);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.searchedAt).toBeDefined();
      expect(result.location.name).toBe("Lyon");
      expect(result.resultCount).toBe(42);
    });

    it("persists the entry to localStorage", () => {
      addToHistory(baseEntry);
      const raw = window.localStorage.getItem("cherche-appart-history");
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].location.name).toBe("Lyon");
    });
  });

  describe("getHistory", () => {
    it("returns empty array when no history exists", () => {
      expect(getHistory()).toEqual([]);
    });

    it("returns all added entries", () => {
      addToHistory(baseEntry);
      addToHistory({
        ...baseEntry,
        location: { ...mockLocation, name: "Paris" },
      });
      const history = getHistory();
      expect(history).toHaveLength(2);
    });

    it("returns most recently added entry first", () => {
      addToHistory({
        ...baseEntry,
        location: { ...mockLocation, name: "Marseille" },
      });
      addToHistory({
        ...baseEntry,
        location: { ...mockLocation, name: "Paris" },
      });
      const history = getHistory();
      expect(history[0].location.name).toBe("Paris");
      expect(history[1].location.name).toBe("Marseille");
    });
  });

  describe("deduplication", () => {
    it("removes previous entry with same location.name and radiusKm", () => {
      addToHistory(baseEntry);
      addToHistory({ ...baseEntry, resultCount: 100 });

      const history = getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].resultCount).toBe(100);
    });

    it("keeps entries with same location but different radiusKm", () => {
      addToHistory(baseEntry);
      addToHistory({ ...baseEntry, radiusKm: 10 });

      const history = getHistory();
      expect(history).toHaveLength(2);
    });

    it("keeps entries with same radiusKm but different location.name", () => {
      addToHistory(baseEntry);
      addToHistory({
        ...baseEntry,
        location: { ...mockLocation, name: "Paris" },
      });

      const history = getHistory();
      expect(history).toHaveLength(2);
    });
  });

  describe("max limit", () => {
    it("enforces maximum of 10 entries", () => {
      for (let i = 0; i < 12; i++) {
        addToHistory({
          ...baseEntry,
          location: { ...mockLocation, name: `City ${i}` },
        });
      }
      const history = getHistory();
      expect(history).toHaveLength(10);
    });

    it("keeps the most recent entries when exceeding max", () => {
      for (let i = 0; i < 12; i++) {
        addToHistory({
          ...baseEntry,
          location: { ...mockLocation, name: `City ${i}` },
        });
      }
      const history = getHistory();
      // Most recent is first, oldest entries are dropped
      expect(history[0].location.name).toBe("City 11");
      expect(history[9].location.name).toBe("City 2");
    });
  });

  describe("clearHistory", () => {
    it("removes all history entries", () => {
      addToHistory(baseEntry);
      addToHistory({
        ...baseEntry,
        location: { ...mockLocation, name: "Paris" },
      });
      clearHistory();
      expect(getHistory()).toEqual([]);
    });

    it("removes the localStorage key entirely", () => {
      addToHistory(baseEntry);
      clearHistory();
      const raw = window.localStorage.getItem("cherche-appart-history");
      expect(raw).toBeNull();
    });
  });

  describe("removeFromHistory", () => {
    it("removes a specific entry by id", () => {
      const entry1 = addToHistory(baseEntry);
      addToHistory({
        ...baseEntry,
        location: { ...mockLocation, name: "Paris" },
      });

      removeFromHistory(entry1.id);
      const history = getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].location.name).toBe("Paris");
    });

    it("does nothing for non-existent id", () => {
      addToHistory(baseEntry);
      removeFromHistory("non-existent-id");
      expect(getHistory()).toHaveLength(1);
    });
  });
});
