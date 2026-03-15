"use client";

import { useState, useCallback, useEffect } from "react";

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

/** Photo carousel with lightbox */
export function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(
        ((index % images.length) + images.length) % images.length,
      );
    },
    [images.length],
  );

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isLightboxOpen, next, prev]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-lg bg-gray-100">
        <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div className="relative">
        <div
          className="cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={images[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              aria-label="Photo précédente"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              aria-label="Photo suivante"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
          {currentIndex + 1}/{images.length}
        </span>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 overflow-hidden rounded ${
                i === currentIndex ? "ring-2 ring-blue-500" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${title} - Miniature ${i + 1}`}
                className="h-14 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Fermer"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={images[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="Photo précédente"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="Photo suivante"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/60 px-3 py-1 text-sm text-white">
            {currentIndex + 1}/{images.length}
          </span>
        </div>
      )}
    </>
  );
}
