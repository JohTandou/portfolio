import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "../../lib/contact";

/* Rate limiter in-memory simple : max 3 requêtes / 15 min par IP */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean } {
  const key = `${ip}:contact`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 3;

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false };
  }

  record.count += 1;
  return { allowed: true };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/*
 * Nettoie une valeur destinée à un en-tête email (from / subject).
 * Pourquoi : un \r ou \n injecté par un visiteur permettrait de forger
 * des en-têtes supplémentaires (header injection) — on les neutralise
 * systématiquement avant toute concaténation.
 */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Trop de tentatives. Réessayez plus tard." },
        { status: 429, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return NextResponse.json(
        { success: false, errors },
        { status: 400, headers: corsHeaders }
      );
    }

    const { nom, email, entreprise, sujet, message } = parsed.data;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      /* Nettoyage anti-injection avant concaténation dans from / subject */
      const safeNom = sanitizeHeaderValue(nom) || "Visiteur";
      const safeEntreprise = sanitizeHeaderValue(entreprise ?? "");
      const safeSujet = sanitizeHeaderValue(sujet);
      const safeSenderLabel = safeEntreprise || safeNom;
      const recipient = process.env.CONTACT_TO_EMAIL || "johtandou@gmail.com";

      /* Resend renvoie { data, error } sans lever d'exception : on doit
         inspecter `error` explicitement, sinon on afficherait un faux succès. */
      const { error } = await resend.emails.send({
        from: `${safeNom} <onboarding@resend.dev>`,
        to: recipient,
        subject: `[${safeSenderLabel}] ${safeSujet}`,
        text: message,
        replyTo: email,
      });

      if (error) {
        /* Log technique sans PII : jamais le nom, l'email ni le message visiteur */
        // eslint-disable-next-line no-console
        console.error("[contact] Échec de l'envoi Resend", error.name, error.message);
        return NextResponse.json(
          { success: false, message: "Erreur lors de l'envoi" },
          { status: 500, headers: corsHeaders }
        );
      }
    } else {
      // eslint-disable-next-line no-console
      console.log("[DEV] Simulation d'envoi d'email — RESEND_API_KEY absente");
    }

    return NextResponse.json(
      { success: true, message: "Message transmis avec succès" },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'envoi" },
      { status: 500, headers: corsHeaders }
    );
  }
}
