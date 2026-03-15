import { test, expect } from "@playwright/test";

test.describe("Search flow", () => {
  test.describe("Home page", () => {
    test("should display the search bar", async ({ page }) => {
      await page.goto("/");
      const searchBar = page.locator("text=Rechercher un bien immobilier");
      await expect(searchBar).toBeVisible();
    });

    test("should display the map container", async ({ page }) => {
      await page.goto("/");
      // The map renders inside a container with min-h-[300px] and leaflet classes,
      // or the loading skeleton with "Chargement de la carte..." text
      const mapArea = page.locator(".leaflet-container, text=Chargement de la carte");
      await expect(mapArea.first()).toBeVisible();
    });

    test("should have navigation links to Recherche, Favoris, Alertes, Historique", async ({
      page,
    }) => {
      await page.goto("/");

      const nav = page.locator("nav");
      await expect(nav).toBeVisible();

      await expect(nav.locator("text=Recherche")).toBeVisible();
      await expect(nav.locator("text=Favoris")).toBeVisible();
      await expect(nav.locator("text=Alertes")).toBeVisible();
      await expect(nav.locator("text=Historique")).toBeVisible();
    });
  });

  test.describe("Favorites page", () => {
    test("should display the empty state", async ({ page }) => {
      await page.goto("/favorites");

      const heading = page.locator("h1", { hasText: "Mes favoris" });
      await expect(heading).toBeVisible();

      const emptyMessage = page.locator("text=Aucun favori enregistré");
      await expect(emptyMessage).toBeVisible();
    });
  });

  test.describe("Alerts page", () => {
    test("should display the empty state", async ({ page }) => {
      await page.goto("/alerts");

      const heading = page.locator("h1", { hasText: "Mes alertes" });
      await expect(heading).toBeVisible();

      const emptyMessage = page.locator("text=Aucune alerte créée");
      await expect(emptyMessage).toBeVisible();
    });
  });

  test.describe("History page", () => {
    test("should display the empty state", async ({ page }) => {
      await page.goto("/history");

      const heading = page.locator("h1", { hasText: "Historique" });
      await expect(heading).toBeVisible();

      const emptyMessage = page.locator("text=Aucun historique");
      await expect(emptyMessage).toBeVisible();
    });
  });
});
