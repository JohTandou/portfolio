"use client";

import { useRef, useState, useCallback } from "react";

interface MobileCarouselProps {
  /** Array of panel elements. Each panel is one "page" of the carousel. */
  panels: React.ReactNode[];
  /** Additional CSS classes for the outer container */
  className?: string;
}

/* MobileCarousel — carrousel horizontal avec scroll-snap, flèches et dots.
   Utilisé uniquement sur mobile (<md). Sur desktop, les sections utilisent leur layout normal. */
export function MobileCarousel({ panels, className = "" }: MobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToPanel = useCallback(
    (direction: "left" | "right") => {
      const container = scrollRef.current;
      if (!container) return;
      const panelWidth = container.firstChild instanceof HTMLElement
        ? container.firstChild.offsetWidth
        : 300;
      const gap = 24;
      const scrollAmount = direction === "left" ? -(panelWidth + gap) : panelWidth + gap;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    },
    []
  );

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const panelWidth = container.firstChild instanceof HTMLElement
      ? container.firstChild.offsetWidth
      : 300;
    const gap = 24;
    const index = Math.round(container.scrollLeft / (panelWidth + gap));
    setActiveIndex(Math.min(Math.max(index, 0), panels.length - 1));
  }, [panels.length]);

  return (
    <div className={`md:hidden ${className}`}>
      {/* Flèches de navigation */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          className="glass-btn font-mono text-2xl px-4 py-2"
          style={{ color: "var(--color-accent-1)" }}
          onClick={() => scrollToPanel("left")}
          aria-label="Panel précédent"
          type="button"
        >
          <span className="hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">&lt;</span>
        </button>
        <button
          className="glass-btn font-mono text-2xl px-4 py-2"
          style={{ color: "var(--color-accent-1)" }}
          onClick={() => scrollToPanel("right")}
          aria-label="Panel suivant"
          type="button"
        >
          <span className="hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">&gt;</span>
        </button>
      </div>

      {/* Carousel scrollable */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          paddingLeft: "7.5vw",
          paddingRight: "7.5vw",
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={handleScroll}
      >
        {panels.map((panel, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{
              width: "85vw",
              maxWidth: "400px",
              scrollSnapAlign: "center",
            }}
          >
            {panel}
          </div>
        ))}
      </div>

      {/* Indicateurs de pagination */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {panels.map((_, index) => (
          <button
            key={index}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                index === activeIndex
                  ? "var(--color-accent-1)"
                  : "var(--color-text-dim)",
              opacity: index === activeIndex ? 1 : 0.4,
              transform: index === activeIndex ? "scale(1.3)" : "scale(1)",
            }}
            onClick={() => {
              const container = scrollRef.current;
              if (!container) return;
              const panelWidth = container.firstChild instanceof HTMLElement
                ? container.firstChild.offsetWidth
                : 300;
              const gap = 24;
              container.scrollTo({
                left: index * (panelWidth + gap),
                behavior: "smooth",
              });
            }}
            aria-label={`Aller au panel ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
