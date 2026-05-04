"use client";

import { useEffect, useState } from "react";

const FRAMES = [
  "[|     ]",
  "[||    ]",
  "[|||   ]",
  "[||||  ]",
  "[||||| ]",
  "[||||||]",
  "[ |||||]",
  "[  ||||]",
  "[   |||]",
  "[    ||]",
  "[     |]",
  "[      ]",
];

/* Spinner ASCII animé style terminal */
export function TerminalSpinner() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-sm text-[var(--color-accent-1)]" role="status" aria-live="polite">
      {FRAMES[frame]}
    </span>
  );
}
