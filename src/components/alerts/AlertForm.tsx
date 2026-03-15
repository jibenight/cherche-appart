"use client";

import { useState } from "react";

interface AlertFormProps {
  onSubmit: (data: { name: string; frequency: "instant" | "daily" | "weekly" }) => void;
  onCancel: () => void;
}

/** Form to create a search alert */
export function AlertForm({ onSubmit, onCancel }: AlertFormProps) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<"instant" | "daily" | "weekly">("daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), frequency });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-card">
      <h3 className="text-base font-semibold text-slate-900">Créer une alerte</h3>

      <div>
        <label htmlFor="alert-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Nom de l&apos;alerte
        </label>
        <input
          id="alert-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Appartement Lyon 3 pièces"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          required
        />
      </div>

      <div>
        <label htmlFor="alert-frequency" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Fréquence de notification
        </label>
        <select
          id="alert-frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as typeof frequency)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="instant">Instantanée</option>
          <option value="daily">Quotidienne</option>
          <option value="weekly">Hebdomadaire</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
        >
          Créer
        </button>
      </div>
    </form>
  );
}
