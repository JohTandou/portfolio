"use client";

/* Container du menu principal cyberpunk */
import { HeroMenuItem } from "./HeroMenuItem";
import { HeroAudioToggle } from "./HeroAudioToggle";

interface MenuItem {
  id: string;
  label: string;
  isPrimary?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "continue", label: "> CONTINUER", isPrimary: true },
  { id: "identity", label: "IDENTITÉ" },
  { id: "experience", label: "EXPÉRIENCE" },
  { id: "tech-arsenal", label: "TECH ARSENAL" },
  { id: "missions", label: "MISSIONS" },
  { id: "contact", label: "CONTACT" },
];

interface HeroMenuProps {
  onNavigate: (sectionId: string) => void;
  isTransitioning: boolean;
}

export function HeroMenu({ onNavigate, isTransitioning }: HeroMenuProps) {
  return (
    <nav
      role="navigation"
      aria-label="Menu principal"
      className="pointer-events-auto"
    >
      <div
        className="relative flex flex-col w-full max-w-[320px] bg-[rgba(10,14,20,0.75)] backdrop-blur-[12px] md:absolute md:left-8 md:bottom-[15vh] md:w-auto md:bg-[rgba(10,14,20,0.6)] md:backdrop-blur-[8px]"
        style={{ border: "1px solid rgba(252, 238, 10, 0.15)" }}
      >
        {MENU_ITEMS.map((item, index) => (
          <HeroMenuItem
            key={item.id}
            label={item.label}
            onClick={() => onNavigate(item.id)}
            isDisabled={isTransitioning}
            index={index}
            isPrimary={item.isPrimary}
          />
        ))}
        <div className="border-t border-[rgba(252,238,10,0.15)] px-3 py-2">
          <HeroAudioToggle />
        </div>
      </div>
    </nav>
  );
}
