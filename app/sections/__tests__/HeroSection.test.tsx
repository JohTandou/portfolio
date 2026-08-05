import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { HeroSection } from '../HeroSection';
import { act } from 'react';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock BackgroundSection
vi.mock('@/components/BackgroundSection', () => ({
  BackgroundSection: ({ children, id, ..._rest }: any) => (
    <section id={id}>{children}</section>
  ),
}));

describe('HeroSection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /* ── Variante publique (défaut) ───────────────────────────────── */

  it("n'affiche PAS de badge sur la variante publique (heroBadge null)", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    // La variante publique n'a pas de badge — le seul .glass-badge
    // avec la classe !inline-flex vient du conteneur badge qui est
    // conditionné à copy.heroBadge (null sur public).
    const badges = container.querySelectorAll('.glass-badge.\\!inline-flex');
    expect(badges.length).toBe(0);
  });

  it("affiche le nom complet en H1 comme titre principal", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1?.textContent).toBe('JOH TANDOU');
    expect(h1?.className).toContain('font-display');
  });

  it("affiche l'intitulé métier complet en H2", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const h2 = container.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2?.textContent).toBe('Software Engineer — Java & Web');
  });

  it("affiche le sous-titre exact tel que défini dans la copie centralisée", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const paragraphs = container.querySelectorAll('p');
    const subtitle = Array.from(paragraphs).find(
      (p) => p.textContent?.includes("2+ ans d’expérience")
    );
    expect(subtitle).toBeTruthy();
    expect(subtitle?.textContent).toBe(
      "2+ ans d’expérience sur des applications métier, des interfaces web et des produits mis en production."
    );
  });

  it("affiche la stack technique exacte dans une police mono", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const paragraphs = container.querySelectorAll('p');
    const stack = Array.from(paragraphs).find(
      (p) =>
        p.textContent?.includes('Java/Swing') &&
        p.className.includes('font-mono')
    );
    expect(stack).toBeTruthy();
    expect(stack?.textContent).toBe(
      'Java/Swing \u00b7 Angular \u00b7 React/Next.js \u00b7 Python/FastAPI \u00b7 SQL'
    );
  });

  it("affiche l'accroche publique exacte (sans 'opérationnel', sans 'DISPONIBLE')", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const paragraphs = container.querySelectorAll('p');
    const tagline = Array.from(paragraphs).find(
      (p) => p.textContent?.includes('Du desktop')
    );
    expect(tagline).toBeTruthy();
    expect(tagline?.textContent).toBe(
      'Du desktop Java/Swing au SaaS full-stack : je construis des applications qui résistent au réel.'
    );
    // Ne doit pas contenir "opérationnel" (mot banni du copy public)
    expect(tagline?.textContent).not.toContain('opérationnel');
    // Ne doit pas contenir "DISPONIBLE"
    expect(tagline?.textContent).not.toContain('DISPONIBLE');
  });

  it("affiche les preuves sociales (TALAN et TOPSEEKER)", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const glassCards = container.querySelectorAll('.glass-card');
    expect(glassCards.length).toBeGreaterThanOrEqual(2);

    const cardTexts = Array.from(glassCards).map(card => card.textContent);
    expect(cardTexts.some(t => t?.includes('TALAN'))).toBe(true);
    expect(cardTexts.some(t => t?.includes('TOPSEEKER'))).toBe(true);
  });

  it("affiche un CTA accessible avec aria-label et le texte d'action", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain('Me contacter');
    expect(button?.getAttribute('aria-label')).toBe(
      "Défiler jusqu'à la section contact"
    );
  });

  it("déclenche le scroll vers #contact au clic sur le CTA", () => {
    const contactSection = document.createElement('section');
    contactSection.id = 'contact';
    contactSection.scrollIntoView = vi.fn();
    document.body.appendChild(contactSection);

    const scrollSpy = vi.spyOn(contactSection, 'scrollIntoView');

    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const button = container.querySelector('button');
    expect(button).toBeTruthy();

    act(() => {
      button!.click();
    });

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });

    scrollSpy.mockRestore();
  });

  /* ── Régression : garde navigation fixe ────────────────────────── */

  it("injecte un spacer de garde navigation (h-8) quand le badge est absent (public)", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    // Le spacer doit être présent avec le data-testid dédié
    const spacer = container.querySelector('[data-testid="hero-nav-spacer"]');
    expect(spacer).toBeTruthy();
    expect(spacer?.className).toContain('h-8');

    // Aucun badge glass-badge avec !inline-flex ne doit être présent
    const badges = container.querySelectorAll('.glass-badge.\\!inline-flex');
    expect(badges.length).toBe(0);
  });

  it("injecte le spacer de garde navigation quand le badge est absent sur la variante geneva", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="geneva" />);
    });

    const spacer = container.querySelector('[data-testid="hero-nav-spacer"]');
    expect(spacer).toBeTruthy();
    expect(spacer?.className).toContain('h-8');
  });

  it("le spacer de garde et le badge sont mutuellement exclusifs (public)", () => {
    // Sur variante publique, heroBadge est null → spacer présent, badge absent
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    const spacer = container.querySelector('[data-testid="hero-nav-spacer"]');
    const badge = container.querySelector('.glass-badge.\\!inline-flex');

    // Exactement un des deux doit être présent (spacer, car heroBadge=null)
    expect(spacer).toBeTruthy();
    expect(badge).toBeNull();
  });

  it("le spacer est présent et le contenu H1 est bien rendu après la garde (public)", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HeroSection variant="public" />);
    });

    // Le spacer précède le H1 dans le DOM
    const spacer = container.querySelector('[data-testid="hero-nav-spacer"]');
    const h1 = container.querySelector('h1');
    expect(spacer).toBeTruthy();
    expect(h1).toBeTruthy();

    // Vérifie l'ordre : spacer avant h1 dans le flux du document
    const children = Array.from(container.querySelector('section')?.children ?? []);
    const spacerIndex = children.indexOf(spacer!);
    const h1Index = children.findIndex(
      (el) => el.tagName === 'H1' || el.querySelector('h1')
    );
    expect(spacerIndex).toBeGreaterThanOrEqual(0);
    // Le H1 (enfant d'un motion.div wrappé en div) apparaît après le spacer
    expect(spacerIndex).toBeLessThan(h1Index >= 0 ? h1Index : children.length);
  });
});
