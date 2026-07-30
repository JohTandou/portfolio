"use client";

import { forwardRef } from "react";

interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextarea?: boolean;
  rows?: number;
}

/* Champ de formulaire style terminal avec prefix commande et validation inline */
export const TerminalInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TerminalInputProps>(
  ({ label, error, isTextarea = false, className = "", ...props }, ref) => {
    const inputId = props.id ?? props.name ?? "";
    const errorId = error ? `${inputId}-error` : undefined;
    const Tag = isTextarea ? "textarea" : "input";

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <label htmlFor={inputId} className="font-mono text-sm">
          <span className="text-green-400">user@portfolio:~$</span>{" "}
          <span className="text-[var(--color-text-high)]">{label}</span>
        </label>
        <Tag
          ref={ref as never}
          id={inputId}
          className="glass-input w-full text-[var(--color-accent-1)] placeholder:text-[var(--color-text-dim)]"
          placeholder={props.placeholder ? `>_ ${props.placeholder}` : undefined}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        {error && (
          <p id={errorId} className="font-mono text-xs text-[var(--color-accent-2)]" role="alert">
            [ERREUR] {error}
          </p>
        )}
      </div>
    );
  }
);

TerminalInput.displayName = "TerminalInput";
