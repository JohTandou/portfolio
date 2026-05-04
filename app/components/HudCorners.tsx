"use client";

/* Composant réutilisable pour afficher les coins HUD avec animation optionnelle */
interface HudCornersProps {
  size?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

export function HudCorners({
  size = 24,
  color = "var(--color-primary)",
  className = "",
  animate = false,
}: HudCornersProps) {
  const pathLength = 12;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 8V2H8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeDasharray={animate ? `${pathLength} ${pathLength}` : undefined}
        strokeDashoffset={animate ? `${pathLength}` : undefined}
        style={
          animate
            ? {
                animation: "hudCornerDraw 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
              }
            : undefined
        }
      />
      <path
        d="M16 2H22V8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeDasharray={animate ? `${pathLength} ${pathLength}` : undefined}
        strokeDashoffset={animate ? `${pathLength}` : undefined}
        style={
          animate
            ? {
                animation:
                  "hudCornerDraw 600ms cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards",
              }
            : undefined
        }
      />
      <path
        d="M22 16V22H16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeDasharray={animate ? `${pathLength} ${pathLength}` : undefined}
        strokeDashoffset={animate ? `${pathLength}` : undefined}
        style={
          animate
            ? {
                animation:
                  "hudCornerDraw 600ms cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards",
              }
            : undefined
        }
      />
      <path
        d="M8 22H2V16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeDasharray={animate ? `${pathLength} ${pathLength}` : undefined}
        strokeDashoffset={animate ? `${pathLength}` : undefined}
        style={
          animate
            ? {
                animation:
                  "hudCornerDraw 600ms cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards",
              }
            : undefined
        }
      />
    </svg>
  );
}
