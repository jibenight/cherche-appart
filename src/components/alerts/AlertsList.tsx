"use client";

import type { SearchAlert } from "@/types/alerts";
import { AlertCard } from "./AlertCard";

interface AlertsListProps {
  alerts: SearchAlert[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/** List of saved alerts */
export function AlertsList({ alerts, onToggle, onDelete }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl gradient-subtle">
          <svg className="h-10 w-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p className="mt-5 text-sm font-semibold text-slate-700">
          Aucune alerte créée
        </p>
        <p className="mt-1.5 text-xs text-slate-400">
          Créez une alerte pour être notifié des nouvelles annonces.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
