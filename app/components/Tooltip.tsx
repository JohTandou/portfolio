"use client";

import { useState } from "react";

/* Tooltip terminal-style réutilisable */
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
}

export function Tooltip({ children, content, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm px-3 py-2 font-mono text-xs"
          style={{
            backgroundColor: "rgba(10, 14, 20, 0.95)",
            border: "1px solid var(--color-accent-1)",
            color: "var(--color-text-high)",
          }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}
