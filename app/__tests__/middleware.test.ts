/* ============================================================
   Tests comportementaux du middleware de redirection.

   Teste l'intégration middleware ↔ logique de redirection :
   - Le middleware redirige (308) pour l'hôte obsolète
   - Le middleware laisse passer (next) pour tous les autres
   - Le pathname et la query string sont conservés
   - La config du matcher exclut bien les assets statiques

   Stratégie de mock : les fonctions vi.fn() sont déclarées
   au niveau module pour garantir que le middleware et le test
   partagent les MÊMES instances de spy.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* ── Spies globaux partagés entre le middleware et le test ────
   vi.hoisted() garantit que les fonctions mock sont initialisées
   AVANT que vi.mock (lui-même hoisté) ne résolve le module. */
const { mockRedirect, mockNext } = vi.hoisted(() => ({
  mockRedirect: vi.fn(),
  mockNext: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: mockRedirect,
    next: mockNext,
  },
}));

/* Importé APRÈS vi.mock pour que le middleware recoive les mocks */
import { middleware, config } from "../../middleware";

/* ── Helpers ─────────────────────────────────────────────────── */
function createMockRequest(overrides: {
  host?: string | null;
  pathname?: string;
  search?: string;
} = {}): any {
  return {
    headers: {
      get: (_name: string) => overrides.host ?? null,
    },
    nextUrl: {
      pathname: overrides.pathname ?? "/",
      search: overrides.search ?? "",
    },
  };
}

beforeEach(() => {
  mockRedirect.mockClear();
  mockNext.mockClear();
});

/* ------------------------------------------------------------------ */
/* 1. Comportement de redirection (308)                               */
/* ------------------------------------------------------------------ */
describe("Middleware — redirection 308 pour l'hôte obsolète", () => {
  it("doit retourner une redirection 308 quand l'hôte est jtandou-portfolio.vercel.app", () => {
    const req = createMockRequest({
      host: "jtandou-portfolio.vercel.app",
      pathname: "/",
      search: "",
    });

    middleware(req);

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(
      "https://jtandou.dev/",
      308,
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("doit conserver le pathname dans la redirection", () => {
    const req = createMockRequest({
      host: "jtandou-portfolio.vercel.app",
      pathname: "/1",
      search: "",
    });

    middleware(req);

    expect(mockRedirect).toHaveBeenCalledWith(
      "https://jtandou.dev/1",
      308,
    );
  });

  it("doit conserver la query string dans la redirection", () => {
    const req = createMockRequest({
      host: "jtandou-portfolio.vercel.app",
      pathname: "/",
      search: "?utm_source=twitter&ref=linkedin",
    });

    middleware(req);

    expect(mockRedirect).toHaveBeenCalledWith(
      "https://jtandou.dev/?utm_source=twitter&ref=linkedin",
      308,
    );
  });

  it("doit conserver path ET query pour /1", () => {
    const req = createMockRequest({
      host: "jtandou-portfolio.vercel.app",
      pathname: "/1",
      search: "?source=email",
    });

    middleware(req);

    expect(mockRedirect).toHaveBeenCalledWith(
      "https://jtandou.dev/1?source=email",
      308,
    );
  });

  it("doit rediriger même avec un hôte en majuscules (normalisation)", () => {
    const req = createMockRequest({
      host: "JTANDOU-PORTFOLIO.VERCEL.APP",
    });

    middleware(req);

    expect(mockRedirect).toHaveBeenCalledTimes(1);
  });

  it("ne doit JAMAIS appeler next() quand une redirection a lieu", () => {
    const req = createMockRequest({
      host: "jtandou-portfolio.vercel.app",
    });

    middleware(req);

    expect(mockNext).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/* 2. Hôtes NON redirigés — next()                                    */
/* ------------------------------------------------------------------ */
describe("Middleware — pas de redirection pour les hôtes légitimes", () => {
  it("ne doit PAS rediriger pour jtandou.dev", () => {
    const req = createMockRequest({ host: "jtandou.dev" });
    middleware(req);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("ne doit PAS rediriger pour localhost", () => {
    const req = createMockRequest({ host: "localhost" });
    middleware(req);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("ne doit PAS rediriger pour localhost:3100", () => {
    const req = createMockRequest({ host: "localhost:3100" });
    middleware(req);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("ne doit PAS rediriger pour une preview Vercel (git branch)", () => {
    const req = createMockRequest({
      host: "jtandou-portfolio-git-feature-redirect.vercel.app",
    });
    middleware(req);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("ne doit PAS rediriger pour une preview Vercel (hash)", () => {
    const req = createMockRequest({
      host: "jtandou-portfolio-a1b2c3d.vercel.app",
    });
    middleware(req);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("ne doit PAS rediriger quand le header Host est absent (null)", () => {
    const req = createMockRequest({ host: null });
    middleware(req);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("ne doit PAS rediriger pour www.jtandou-portfolio.vercel.app (sous-domaine)", () => {
    const req = createMockRequest({
      host: "www.jtandou-portfolio.vercel.app",
    });
    middleware(req);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("ne doit PAS rediriger pour un domaine complètement différent", () => {
    const req = createMockRequest({ host: "example.com" });
    middleware(req);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/* 3. Configuration du matcher                                        */
/* ------------------------------------------------------------------ */
describe("Middleware — config du matcher", () => {
  it("doit exporter une config avec un matcher", () => {
    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
    expect(config.matcher.length).toBeGreaterThan(0);
  });

  it("le matcher doit exclure _next/static", () => {
    const matcherStr = config.matcher.join(" ");
    expect(matcherStr).toContain("_next/static");
  });

  it("le matcher doit exclure _next/image", () => {
    const matcherStr = config.matcher.join(" ");
    expect(matcherStr).toContain("_next/image");
  });

  it("le matcher doit exclure favicon.ico", () => {
    const matcherStr = config.matcher.join(" ");
    expect(matcherStr).toContain("favicon");
  });

  it("le matcher doit exclure les assets statiques publics", () => {
    const matcherStr = config.matcher.join(" ");
    expect(matcherStr).toContain("assets/");
  });
});

/* ------------------------------------------------------------------ */
/* 4. Cas limites — middleware function exists                        */
/* ------------------------------------------------------------------ */
describe("Middleware — intégrité structurelle", () => {
  it("doit exporter une fonction middleware", () => {
    expect(middleware).toBeDefined();
    expect(typeof middleware).toBe("function");
  });

  it("ne doit pas lancer d'erreur pour un hôte vide", () => {
    const req = createMockRequest({ host: "" });
    expect(() => middleware(req)).not.toThrow();
  });

  it("ne doit pas lancer d'erreur pour un pathname vide", () => {
    const req = createMockRequest({
      host: "jtandou-portfolio.vercel.app",
      pathname: "",
    });
    expect(() => middleware(req)).not.toThrow();
    expect(mockRedirect).toHaveBeenCalled();
  });
});
