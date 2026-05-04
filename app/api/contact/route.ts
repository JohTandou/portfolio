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
      await resend.emails.send({
        from: "Portfolio Joh Tandou <onboarding@resend.dev>",
        to: "joh.tandou@gmail.com",
        subject: `[Portfolio] ${sujet} — de ${nom}`,
        text: `Nom: ${nom}\nEmail: ${email}\nEntreprise: ${entreprise || "Non spécifiée"}\n\nMessage:\n${message}`,
        replyTo: email,
      });
    } else {
      // eslint-disable-next-line no-console
      console.log("[DEV] Simulation d'envoi d'email :", { nom, email, entreprise, sujet, message });
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
