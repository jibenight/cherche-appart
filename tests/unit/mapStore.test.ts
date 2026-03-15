import { useMapStore } from "@/store/mapStore";
import type { MapViewport } from "@/types/map";

describe("useMapStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useMapStore.setState({
      viewport: null,
      hoveredPropertyId: null,
      selectedPropertyId: null,
      searchAsIMove: false,
    });
  });

  describe("initial state", () => {
    it("should have null viewport", () => {
      const { viewport } = useMapStore.getState();
      expect(viewport).toBeNull();
    });

    it("should have null hoveredPropertyId", () => {
      const { hoveredPropertyId } = useMapStore.getState();
      expect(hoveredPropertyId).toBeNull();
    });

    it("should have null selectedPropertyId", () => {
      const { selectedPropertyId } = useMapStore.getState();
      expect(selectedPropertyId).toBeNull();
    });

    it("should have searchAsIMove set to false", () => {
      const { searchAsIMove } = useMapStore.getState();
      expect(searchAsIMove).toBe(false);
    });
  });

  describe("setHoveredPropertyId", () => {
    it("should set the hovered property id", () => {
      useMapStore.getState().setHoveredPropertyId("prop-123");
      expect(useMapStore.getState().hoveredPropertyId).toBe("prop-123");
    });

    it("should clear the hovered property id when set to null", () => {
      useMapStore.getState().setHoveredPropertyId("prop-123");
      useMapStore.getState().setHoveredPropertyId(null);
      expect(useMapStore.getState().hoveredPropertyId).toBeNull();
    });

    it("should replace the previous hovered property id", () => {
      useMapStore.getState().setHoveredPropertyId("prop-1");
      useMapStore.getState().setHoveredPropertyId("prop-2");
      expect(useMapStore.getState().hoveredPropertyId).toBe("prop-2");
    });
  });

  describe("setSelectedPropertyId", () => {
    it("should set the selected property id", () => {
      useMapStore.getState().setSelectedPropertyId("prop-456");
      expect(useMapStore.getState().selectedPropertyId).toBe("prop-456");
    });

    it("should clear the selected property id when set to null", () => {
      useMapStore.getState().setSelectedPropertyId("prop-456");
      useMapStore.getState().setSelectedPropertyId(null);
      expect(useMapStore.getState().selectedPropertyId).toBeNull();
    });

    it("should replace the previous selected property id", () => {
      useMapStore.getState().setSelectedPropertyId("prop-1");
      useMapStore.getState().setSelectedPropertyId("prop-2");
      expect(useMapStore.getState().selectedPropertyId).toBe("prop-2");
    });
  });

  describe("toggleSearchAsIMove", () => {
    it("should toggle from false to true", () => {
      expect(useMapStore.getState().searchAsIMove).toBe(false);
      useMapStore.getState().toggleSearchAsIMove();
      expect(useMapStore.getState().searchAsIMove).toBe(true);
    });

    it("should toggle from true to false", () => {
      useMapStore.getState().setSearchAsIMove(true);
      useMapStore.getState().toggleSearchAsIMove();
      expect(useMapStore.getState().searchAsIMove).toBe(false);
    });

    it("should toggle back and forth correctly", () => {
      useMapStore.getState().toggleSearchAsIMove();
      expect(useMapStore.getState().searchAsIMove).toBe(true);
      useMapStore.getState().toggleSearchAsIMove();
      expect(useMapStore.getState().searchAsIMove).toBe(false);
      useMapStore.getState().toggleSearchAsIMove();
      expect(useMapStore.getState().searchAsIMove).toBe(true);
    });
  });

  describe("setSearchAsIMove", () => {
    it("should set searchAsIMove to true", () => {
      useMapStore.getState().setSearchAsIMove(true);
      expect(useMapStore.getState().searchAsIMove).toBe(true);
    });

    it("should set searchAsIMove to false", () => {
      useMapStore.getState().setSearchAsIMove(true);
      useMapStore.getState().setSearchAsIMove(false);
      expect(useMapStore.getState().searchAsIMove).toBe(false);
    });
  });

  describe("setViewport", () => {
    it("should store viewport data", () => {
      const viewport: MapViewport = {
        center: [48.8566, 2.3522],
        zoom: 12,
        bounds: {
          north: 48.9,
          south: 48.8,
          east: 2.4,
          west: 2.3,
        },
      };

      useMapStore.getState().setViewport(viewport);

      const stored = useMapStore.getState().viewport;
      expect(stored).toEqual(viewport);
      expect(stored!.center).toEqual([48.8566, 2.3522]);
      expect(stored!.zoom).toBe(12);
      expect(stored!.bounds.north).toBe(48.9);
      expect(stored!.bounds.south).toBe(48.8);
      expect(stored!.bounds.east).toBe(2.4);
      expect(stored!.bounds.west).toBe(2.3);
    });

    it("should replace the previous viewport", () => {
      const viewport1: MapViewport = {
        center: [48.8566, 2.3522],
        zoom: 12,
        bounds: { north: 48.9, south: 48.8, east: 2.4, west: 2.3 },
      };
      const viewport2: MapViewport = {
        center: [45.764, 4.8357],
        zoom: 14,
        bounds: { north: 45.8, south: 45.7, east: 4.9, west: 4.7 },
      };

      useMapStore.getState().setViewport(viewport1);
      useMapStore.getState().setViewport(viewport2);

      const stored = useMapStore.getState().viewport;
      expect(stored).toEqual(viewport2);
      expect(stored!.center).toEqual([45.764, 4.8357]);
      expect(stored!.zoom).toBe(14);
    });
  });
});
