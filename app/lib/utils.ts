/* Utilitaires de classes CSS conditionnelles */
type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean };

function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (typeof input === "object" && input !== null) {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}

/* Fusion de classes Tailwind sans conflits (version simplifiée sans tailwind-merge) */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}
