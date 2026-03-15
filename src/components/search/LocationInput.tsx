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
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
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
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          </div>
        )}
        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.name}-${suggestion.postcode}`}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-4 py-3 text-sm transition-colors ${
                index === activeIndex
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(suggestion);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="font-medium">
                {suggestion.name}{" "}
                <span className="text-gray-400">({suggestion.postcode})</span>
              </div>
              <div className="text-xs text-gray-400">{suggestion.department}</div>
            </li>
          ))}
        </ul>
      )}

      {/* No results message */}
      {isOpen && !isLoading && suggestions.length === 0 && debouncedQuery.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500 shadow-lg">
          Aucun résultat trouvé pour &ldquo;{debouncedQuery}&rdquo;
        </div>
      )}
    </div>
  );
}
