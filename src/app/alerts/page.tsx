"use client";

import { useState, useEffect } from "react";
import { AlertsList } from "@/components/alerts/AlertsList";
import { AlertForm } from "@/components/alerts/AlertForm";
import { Navigation } from "@/components/layout/Navigation";
import {
  getAlerts,
  createAlert,
  toggleAlert,
  deleteAlert,
} from "@/services/alertsService";
import { useSearchStore } from "@/store/searchStore";
import { useFilterStore } from "@/store/filterStore";
import type { SearchAlert } from "@/types/alerts";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SearchAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const location = useSearchStore((s) => s.location);
  const radiusKm = useSearchStore((s) => s.radiusKm);
  const filters = useFilterStore((s) => s.filters);

  useEffect(() => {
    setAlerts(getAlerts());
  }, []);

  const handleCreate = (data: {
    name: string;
    frequency: "instant" | "daily" | "weekly";
  }) => {
    if (!location) return;
    createAlert({
      ...data,
      filters,
      location,
      radiusKm,
      isActive: true,
    });
    setAlerts(getAlerts());
    setShowForm(false);
  };

  const handleToggle = (id: string) => {
    toggleAlert(id);
    setAlerts(getAlerts());
  };

  const handleDelete = (id: string) => {
    deleteAlert(id);
    setAlerts(getAlerts());
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Mes alertes</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Créer une alerte
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6">
            <AlertForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <AlertsList
          alerts={alerts}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
