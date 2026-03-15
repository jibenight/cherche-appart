"use client";

type ViewMode = "map" | "list";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/** Mobile toggle between map and list views */
export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-card lg:hidden">
      <button
        onClick={() => onChange("map")}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          mode === "map"
            ? "gradient-brand text-white shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        }`}
        aria-label="Afficher la carte"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Carte
      </button>
      <button
        onClick={() => onChange("list")}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          mode === "list"
            ? "gradient-brand text-white shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        }`}
        aria-label="Afficher la liste"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Liste
      </button>
    </div>
  );
}
