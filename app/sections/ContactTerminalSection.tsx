"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { BackgroundSection } from "../components/BackgroundSection";
import { contactSchema, ContactFormData } from "../lib/contact";
import { TerminalInput } from "../components/TerminalInput";
import { TerminalSpinner } from "../components/TerminalSpinner";
import { TerminalButton } from "../components/TerminalButton";
import { DigitizeText } from "../components/DigitizeText";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

type SubmitStatus = "idle" | "sending" | "success" | "error";

/* Section contact immersive style terminal — formulaire avec validation Zod */
export function ContactTerminalSection() {
  const { isReducedMotion } = useReducedMotion();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  function validateField(name: keyof ContactFormData, value: string) {
    const shape = contactSchema.shape[name];
    const result = shape.safeParse(value);
    if (!result.success) {
      setError(name, { message: result.error.issues[0].message });
    } else {
      clearErrors(name);
    }
  }

  async function onSubmit(data: ContactFormData) {
    setStatus("sending");
    setServerMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.status === 429) {
        setStatus("error");
        setServerMessage("Trop de tentatives. Réessayez plus tard.");
        return;
      }

      if (!json.success) {
        setStatus("error");
        setServerMessage(json.message || "Une erreur est survenue.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setServerMessage("Erreur réseau. Vérifiez votre connexion.");
    }
  }

  return (
    <BackgroundSection id="contact" backgroundImage="/backgrounds/contact.jpg" contentPosition="right">
    <div className="relative w-full px-6 py-12 md:py-24 md:px-12 lg:px-20">
      <div className="glass-panel p-8 mx-auto max-w-2xl overflow-hidden">
        <h2 className="mb-6 md:mb-12 font-terminal text-xl tracking-wider md:text-3xl md:tracking-widest text-[var(--color-primary)]">
          ÉTABLIR_UNE_CONNEXION
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 md:gap-8 pt-4 md:pt-8"
          aria-live="polite"
          aria-busy={status === "sending"}
          noValidate
        >
          <TerminalInput
            label="nom"
            placeholder="Dupont"
            error={errors.nom?.message}
            {...register("nom", {
              onChange: (e) => validateField("nom", e.target.value),
            })}
          />

          <TerminalInput
            label="email"
            type="email"
            placeholder="jean@exemple.com"
            error={errors.email?.message}
            {...register("email", {
              onChange: (e) => validateField("email", e.target.value),
            })}
          />

          <TerminalInput
            label="entreprise (optionnel)"
            placeholder="Mon entreprise"
            error={errors.entreprise?.message}
            {...register("entreprise", {
              onChange: (e) => validateField("entreprise", e.target.value),
            })}
          />

          <TerminalInput
            label="sujet"
            placeholder="Mon projet web"
            error={errors.sujet?.message}
            {...register("sujet", {
              onChange: (e) => validateField("sujet", e.target.value),
            })}
          />

          <TerminalInput
            label="message"
            isTextarea
            rows={5}
            placeholder="Décrivez votre besoin en quelques lignes..."
            error={errors.message?.message}
            {...register("message", {
              onChange: (e) => validateField("message", e.target.value),
            })}
          />

          <div className="flex items-center gap-4">
            <TerminalButton
              type="submit"
              disabled={status === "sending"}
              className="w-full md:w-auto"
            >
              {status === "sending" ? (
                <span className="flex items-center gap-3">
                  <TerminalSpinner />
                  ENVOI_EN_COURS...
                </span>
              ) : (
                "TRANSMETTRE"
              )}
            </TerminalButton>
          </div>

          {status === "success" && (
            <div className="flex flex-col gap-2 font-mono">
              <p className="text-green-400">[MESSAGE_TRANSMIS]</p>
              <p className="text-[var(--color-text-high)]">
                <DigitizeText
                  text="Connexion établie avec succès."
                  onComplete={() => setTimeout(reset, 3000)}
                />
              </p>
            </div>
          )}

          {status === "error" && (
            <p className="font-mono text-sm text-[var(--color-accent-2)] break-words" role="alert">
              [ÉCHEC] {serverMessage}
            </p>
          )}
        </form>
      </div>
    </div>
    </BackgroundSection>
  );
}
