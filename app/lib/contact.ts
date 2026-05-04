import { z } from "zod";

/* Schéma de validation du formulaire de contact — partagé client et serveur */
export const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  entreprise: z.string().optional(),
  sujet: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z.string().min(20, "Le message doit contenir au moins 20 caractères").max(1000, "Le message ne doit pas dépasser 1000 caractères"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
