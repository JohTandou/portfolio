"use client";

import { useEffect } from "react";

/* Verrouille le scroll du body quand une modale est ouverte */
export function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (lock) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}
