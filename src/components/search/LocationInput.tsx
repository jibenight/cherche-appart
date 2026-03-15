"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchCities } from "@/services/geocoding";
import { useSearchStore } from "@/store/searchStore";
import type { GeoSuggestion, Location } from "@/types/location";

export function LocationInput() {
  const { location, setLocation } = useSearchStore();

  const [query, setQuery] = useState(location?.name ?? "");
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    searchCities(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results);
          setIsOpen(results.length > 0);
          setActiveIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Sync input with store location
  useEffect(() => {
    if (location) {
      setQuery(`${location.name} (${location.postcode})`);
    }
  }, [location]);

  const handleSelect = useCallback(
    (suggestion: GeoSuggestion) => {
      const loc: Location = {
        name: suggestion.name,
        postcode: suggestion.postcode,
        department: suggestion.department,
        lat: suggestion.coordinates[1], // GeoJSON [lng, lat]
        lng: suggestion.coordinates[0],
      };
      setLocation(loc);
      setQuery(`${suggestion.name} (${suggestion.postcode})`);
      setIsOpen(false);
      setSuggestions([]);
      inputRef.current?.blur();
    },
    [setLocation],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setLocation(null);
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, [setLocation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < suggestions.length) {
            handleSelect(suggestions[activeIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setActiveIndex(-1);
          break;
      }
    },
    [isOpen, activeIndex, suggestions, handleSelect],
  );

  return (
    <div className="relative w-full">
      <label htmlFor="location-input" className="sr-only">
        Rechercher une ville
      </label>
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <input
          ref={inputRef}
          id="location-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value.length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setIsOpen(false), 200);
          }}
          placeholder="Rechercher une ville ou un code postal..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-10 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="location-suggestions"
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
          autoComplete="off"
        />
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-brand-500" />
          </div>
        )}
        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Effacer la recherche"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="location-suggestions"
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-elevated animate-slide-down"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.name}-${suggestion.postcode}`}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-4 py-3 text-sm transition-colors ${
                index === activeIndex
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(suggestion);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="font-medium">
                    {suggestion.name}{" "}
                    <span className="font-normal text-slate-400">({suggestion.postcode})</span>
                  </div>
                  <div className="text-xs text-slate-400">{suggestion.department}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* No results message */}
      {isOpen && !isLoading && suggestions.length === 0 && debouncedQuery.length >= 2 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-elevated animate-slide-down">
          Aucun résultat trouvé pour &ldquo;{debouncedQuery}&rdquo;
        </div>
      )}
    </div>
  );
}
