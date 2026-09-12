/* ============================================================
   Tests complémentaires de la route API POST /api/contact.

   Pourquoi ce fichier : le fichier principal vérifie surtout la
   présence des valeurs (toContain). Ici on verrouille le FORMAT
   EXACT de l'email construit, la sémantique de sanitisation des
   en-têtes (remplacement des \r\n par un espace) et les replis
   du code (nom vide après nettoyage, CONTACT_TO_EMAIL).

   Additif uniquement : aucun test existant n'est modifié.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* ── Helpers ─────────────────────────────────────────────────── */

function createMockRequest(body: unknown, ip: string = "127.0.0.1") {
  return {
    headers: {
      get: (name: string) => (name === "x-forwarded-for" ? ip : null),
    },
    json: async () => body,
  };
}

/** Monte un mock 'resend' en succès et retourne le spy `send`. */
function mockResendSuccess() {
  const mockSend = vi
    .fn()
    .mockResolvedValue({ data: { id: "email-id-format" }, error: null });
  vi.doMock("resend", () => ({
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: mockSend },
    })),
  }));
  return mockSend;
}

beforeEach(() => {
  vi.resetModules();
  vi.unmock("resend");
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
});

/* ------------------------------------------------------------------ */
/* Format exact de l'email                                             */
/* ------------------------------------------------------------------ */
describe("POST /api/contact — format exact de l'email", () => {
  it("assemble from/to/replyTo/subject/text exactement comme la spec", async () => {
    process.env.RESEND_API_KEY = "re_test_exact";
    const mockSend = mockResendSuccess();

    const { POST } = await import("../route");

    const req = createMockRequest({
      nom: "Jean Dupont",
      email: "jean@example.com",
      entreprise: "ACME",
      sujet: "Demande de devis",
      message: "Bonjour, je souhaite obtenir un devis pour une refonte complète.",
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const callArgs = mockSend.mock.calls[0][0] as Record<string, unknown>;
    expect(callArgs.from).toBe("Jean Dupont <onboarding@resend.dev>");
    expect(callArgs.to).toBe("johtandou@gmail.com");
    expect(callArgs.replyTo).toBe("jean@example.com");
    expect(callArgs.subject).toBe("[ACME] Demande de devis");
    expect(callArgs.text).toBe(
      "Bonjour, je souhaite obtenir un devis pour une refonte complète."
    );

    delete process.env.RESEND_API_KEY;
  });

  it("remplace les \\r\\n par un espace dans from et subject (valeur nettoyée exacte)", async () => {
    process.env.RESEND_API_KEY = "re_test_sanitize";
    const mockSend = mockResendSuccess();

    const { POST } = await import("../route");

    const req = createMockRequest({
      nom: "Jean\r\nDupont",
      email: "jean@example.com",
      entreprise: "ACME\nCorp",
      sujet: "Sujet\r\ninjecté",
      message: "Message suffisamment long pour passer la validation du schéma.",
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const callArgs = mockSend.mock.calls[0][0] as Record<string, unknown>;
    expect(callArgs.from).toBe("Jean Dupont <onboarding@resend.dev>");
    expect(callArgs.subject).toBe("[ACME Corp] Sujet injecté");
    expect(callArgs.replyTo).toBe("jean@example.com");

    delete process.env.RESEND_API_KEY;
  });

  it("replie l'expéditeur et le sujet sur 'Visiteur' quand le nom ne contient que des sauts de ligne", async () => {
    process.env.RESEND_API_KEY = "re_test_fallback";
    const mockSend = mockResendSuccess();

    const { POST } = await import("../route");

    const req = createMockRequest({
      nom: "\r\n",
      email: "jean@example.com",
      sujet: "Sans entreprise",
      message: "Ce message de test ne précise volontairement aucune entreprise.",
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const callArgs = mockSend.mock.calls[0][0] as Record<string, unknown>;
    expect(callArgs.from).toBe("Visiteur <onboarding@resend.dev>");
    expect(callArgs.subject).toBe("[Visiteur] Sans entreprise");

    delete process.env.RESEND_API_KEY;
  });

  it("respecte CONTACT_TO_EMAIL quand la variable est définie", async () => {
    process.env.RESEND_API_KEY = "re_test_recipient";
    process.env.CONTACT_TO_EMAIL = "equipe@portfolio.dev";
    const mockSend = mockResendSuccess();

    const { POST } = await import("../route");

    const req = createMockRequest({
      nom: "Jean Dupont",
      email: "jean@example.com",
      entreprise: "ACME",
      sujet: "Test destinataire",
      message: "Message suffisamment long pour franchir la validation Zod.",
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const callArgs = mockSend.mock.calls[0][0] as Record<string, unknown>;
    expect(callArgs.to).toBe("equipe@portfolio.dev");

    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
  });
});
