"use client";

import type { SearchAlert } from "@/types/alerts";

interface AlertCardProps {
  alert: SearchAlert;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const FREQUENCY_LABELS: Record<string, string> = {
  instant: "Instantanée",
  daily: "Quotidienne",
  weekly: "Hebdomadaire",
};

/** Alert summary card with on/off toggle and delete */
export function AlertCard({ alert, onToggle, onDelete }: AlertCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-card transition-all hover:shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold text-slate-900">{alert.name}</h3>
          <span
            className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${
              alert.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {alert.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {alert.location.name} — {FREQUENCY_LABELS[alert.frequency]}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Créée le{" "}
          {new Date(alert.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle */}
        <button
          onClick={() => onToggle(alert.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            alert.isActive ? "bg-brand-600" : "bg-slate-200"
          }`}
          aria-label={alert.isActive ? "Désactiver l'alerte" : "Activer l'alerte"}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              alert.isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(alert.id)}
          className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
          aria-label="Supprimer l'alerte"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
