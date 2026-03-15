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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900">Créer une alerte</h3>

      <div>
        <label htmlFor="alert-name" className="mb-1 block text-xs font-medium text-gray-600">
          Nom de l&apos;alerte
        </label>
        <input
          id="alert-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Appartement Lyon 3 pièces"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          required
        />
      </div>

      <div>
        <label htmlFor="alert-frequency" className="mb-1 block text-xs font-medium text-gray-600">
          Fréquence de notification
        </label>
        <select
          id="alert-frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as typeof frequency)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
        >
          <option value="instant">Instantanée</option>
          <option value="daily">Quotidienne</option>
          <option value="weekly">Hebdomadaire</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Créer
        </button>
      </div>
    </form>
  );
}
