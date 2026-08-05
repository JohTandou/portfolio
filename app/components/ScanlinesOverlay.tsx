"use client";

/* Overlay de scanlines CRT en plein écran */
export function ScanlinesOverlay() {
  return (
    <>
      {/* Pattern SVG de scanlines horizontales */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 5px)",
          opacity: 0.08,
        }}
        aria-hidden="true"
      />

      {/* Vignette radiale */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
