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
    <main className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mes alertes</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Recevez des notifications pour vos recherches
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
            >
              Créer une alerte
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6 animate-slide-up">
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
