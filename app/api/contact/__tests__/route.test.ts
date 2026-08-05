/* ============================================================
   Tests de la route API POST /api/contact.

   Couvre strictement :
   - Simulation sans RESEND_API_KEY → 200, aucune PII dans console.log
   - Validation Zod → 400 avec erreurs par champ
   - Rate limiting → 429 au 4e appel depuis la même IP
   - Envoi via Resend quand RESEND_API_KEY est définie
   - Headers CORS dans toutes les réponses

   Stratégie d'isolation du rate limiter :
   vi.resetModules() + import() dynamique pour réinitialiser
   l'état du Map interne entre chaque test.
   Chaque test importe un module frais avec son propre rateLimitMap.

   Aucune modification du code de production pour le test.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* ── Helpers ─────────────────────────────────────────────────── */

/**
 * Crée une requête mock compatible avec l'interface utilisée
 * par le handler POST : req.headers.get() et req.json().
 *
 * @param body  Corps JSON de la requête
 * @param ip    Adresse IP simulée (x-forwarded-for)
 */
function createMockRequest(
  body: unknown,
  ip: string = "127.0.0.1"
) {
  return {
    headers: {
      get: (name: string) => (name === "x-forwarded-for" ? ip : null),
    },
    json: async () => body,
  };
}

/* ── Réinitialisation complète avant chaque test ───────────────
   Trois actions :
   1. vi.resetModules() → vide le cache des modules → nouvel import = state vierge
   2. vi.unmock("resend") → supprime tout mock posé par un test précédent
   3. delete process.env.RESEND_API_KEY → garantit le mode simulation par défaut */
beforeEach(async () => {
  vi.resetModules();
  vi.unmock("resend");
  delete process.env.RESEND_API_KEY;
});

/* ------------------------------------------------------------------ */
/* 1. Simulation sans RESEND_API_KEY                                  */
/* ------------------------------------------------------------------ */
describe("POST /api/contact — simulation (sans RESEND_API_KEY)", () => {
  it("retourne 200 avec success:true et ne logue aucune PII", async () => {
    /* Import dynamique APRÈS resetModules = module frais */
    const { POST } = await import("../route");

    /* Intercepter console.log pour vérifier l'absence de données personnelles */
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const req = createMockRequest({
      nom: "Jean Dupont",
      email: "jean.dupont@example.com",
      entreprise: "ACME Corp",
      sujet: "Opportunité professionnelle",
      message: "Bonjour, je souhaite échanger avec vous concernant une mission.",
    });

    const res = await POST(req as any);
    const body = await res.json();

    /* Assertions : statut et payload */
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Message transmis avec succès");

    /* Assertions : aucune donnée personnelle dans les logs console */
    const consoleCalls = consoleSpy.mock.calls.flat();
    const allLogs = consoleCalls.join(" ");
    expect(allLogs).not.toContain("Jean Dupont");
    expect(allLogs).not.toContain("jean.dupont@example.com");
    expect(allLogs).not.toContain("ACME Corp");
    expect(allLogs).not.toContain("Opportunité professionnelle");
    expect(allLogs).toContain("RESEND_API_KEY absente");

    consoleSpy.mockRestore();
  });
});

/* ------------------------------------------------------------------ */
/* 2. Validation Zod → 400 avec erreurs par champ                     */
/* ------------------------------------------------------------------ */
describe("POST /api/contact — validation", () => {
  it("retourne 400 avec les erreurs par champ pour des données invalides", async () => {
    const { POST } = await import("../route");

    /* Chaque champ est volontairement invalide */
    const req = createMockRequest({
      nom: "J",             // < 2 caractères
      email: "pas-un-email", // format invalide
      sujet: "Hi",           // < 5 caractères
      message: "Court",      // < 20 caractères
    });

    const res = await POST(req as any);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.errors).toBeDefined();
    expect(body.errors.length).toBeGreaterThanOrEqual(4);

    /* Vérifier que chaque champ problématique est signalé individuellement */
    const errorFields = body.errors.map((e: { field: string }) => e.field);
    expect(errorFields).toContain("nom");
    expect(errorFields).toContain("email");
    expect(errorFields).toContain("sujet");
    expect(errorFields).toContain("message");
  });
});

/* ------------------------------------------------------------------ */
/* 3. Rate limiting → 429 au 4e appel                                 */
/* ------------------------------------------------------------------ */
describe("POST /api/contact — rate limiting", () => {
  it("bloque la 4e requête depuis la même IP avec un statut 429", async () => {
    /* Module frais → rate limiter vierge (compteur à 0) */
    const { POST } = await import("../route");

    const validBody = {
      nom: "Jean Dupont",
      email: "jean@example.com",
      entreprise: "ACME",
      sujet: "Test rate limit",
      message: "Ce message contient suffisamment de caractères pour passer la validation.",
    };

    /* Requêtes 1 à 3 : autorisées (200) */
    for (let i = 0; i < 3; i++) {
      const req = createMockRequest(validBody);
      const res = await POST(req as any);
      expect(res.status).toBe(200);
    }

    /* Requête 4 : bloquée (429) */
    const req = createMockRequest(validBody);
    const res = await POST(req as any);
    const body = await res.json();

    expect(res.status).toBe(429);
    expect(body.success).toBe(false);
    expect(body.message).toContain("Trop de tentatives");
  });
});

/* ------------------------------------------------------------------ */
/* 4. Envoi via Resend quand la clé est définie                       */
/* ------------------------------------------------------------------ */
describe("POST /api/contact — envoi Resend (mocké)", () => {
  it("appelle Resend et retourne 200 quand RESEND_API_KEY est définie", async () => {
    /* Définir la clé AVANT l'import du module */
    process.env.RESEND_API_KEY = "re_test_abcdef";

    /* Mock du module 'resend' : simule un envoi réussi */
    const mockSend = vi.fn().mockResolvedValue({ id: "email-id-123" });
    vi.doMock("resend", () => ({
      Resend: vi.fn().mockImplementation(() => ({
        emails: { send: mockSend },
      })),
    }));

    const { POST } = await import("../route");

    const req = createMockRequest({
      nom: "Jean Dupont",
      email: "jean@example.com",
      entreprise: "ACME",
      sujet: "Test Resend",
      message: "Ceci est un message de test pour vérifier l'envoi via Resend.",
    });

    const res = await POST(req as any);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);

    /* Vérifier l'appel à Resend */
    expect(mockSend).toHaveBeenCalledOnce();
    const callArgs = mockSend.mock.calls[0][0] as Record<string, unknown>;
    expect(callArgs.to).toBe("johtandou@gmail.com");
    expect(callArgs.subject).toContain("Test Resend");
    expect(callArgs.subject).toContain("Jean Dupont");
    expect(callArgs.replyTo).toBe("jean@example.com");

    /* Nettoyer la clé */
    delete process.env.RESEND_API_KEY;
  });
});

/* ------------------------------------------------------------------ */
/* 5. Headers CORS                                                     */
/* ------------------------------------------------------------------ */
describe("POST /api/contact — headers CORS", () => {
  it("inclut les headers CORS dans une réponse 200", async () => {
    const { POST } = await import("../route");

    const req = createMockRequest({
      nom: "Jean Dupont",
      email: "jean@example.com",
      entreprise: "ACME",
      sujet: "Test CORS headers",
      message: "Vérification des headers CORS dans la réponse du serveur.",
    });

    const res = await POST(req as any);

    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
  });

  it("inclut les headers CORS même en cas d'erreur 400", async () => {
    const { POST } = await import("../route");

    const req = createMockRequest({
      nom: "X",
      email: "invalide",
      sujet: "",
      message: "",
    });

    const res = await POST(req as any);

    expect(res.status).toBe(400);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("inclut les headers CORS même en cas de rate limit 429", async () => {
    const { POST } = await import("../route");

    const validBody = {
      nom: "Jean Dupont",
      email: "jean@example.com",
      entreprise: "ACME",
      sujet: "Test CORS 429",
      message: "Ce message est suffisamment long pour passer la validation complète.",
    };

    /* Saturer le rate limiter (3 requêtes) */
    for (let i = 0; i < 3; i++) {
      const req = createMockRequest(validBody);
      await POST(req as any);
    }

    /* 4e requête → 429 */
    const req = createMockRequest(validBody);
    const res = await POST(req as any);

    expect(res.status).toBe(429);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("le handler OPTIONS retourne les headers CORS", async () => {
    const { OPTIONS } = await import("../route");

    const res = await OPTIONS();

    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
  });
});
