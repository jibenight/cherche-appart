"use client";

import { useState } from "react";
import { ViewToggle } from "@/components/results/ViewToggle";

interface SplitViewProps {
  mapView: React.ReactNode;
  listView: React.ReactNode;
}

/** Side-by-side layout for desktop, toggleable views on mobile */
export function SplitView({ mapView, listView }: SplitViewProps) {
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  return (
    <div className="flex flex-1 flex-col">
      {/* Mobile toggle */}
      <div className="flex justify-center p-2.5 lg:hidden">
        <ViewToggle mode={mobileView} onChange={setMobileView} />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Map */}
        <div
          className={`h-[50vh] w-full lg:h-auto lg:flex-1 ${
            mobileView === "list" ? "hidden lg:block" : ""
          }`}
        >
          {mapView}
        </div>

        {/* List */}
        <div
          className={`w-full border-t border-slate-200/60 bg-white lg:w-[420px] lg:border-l lg:border-t-0 lg:overflow-y-auto ${
            mobileView === "map" ? "hidden lg:block" : "flex-1"
          }`}
        >
          {listView}
        </div>
      </div>
    </div>
  );
}
