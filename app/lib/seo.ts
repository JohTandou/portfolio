/* ============================================================
   Constantes et types SEO — source unique de vérité
   pour les métadonnées structurées (JSON-LD, Open Graph).
   Les layouts importent ces constantes pour garantir
   la cohérence entre toutes les couches de la page.
   ============================================================ */

// ─── Identité (données factuelles, zéro hypothèse) ───────────────────

/** Domaine canonique du portfolio */
export const SEO_DOMAIN = "https://jtandou.dev" as const;

/** Identifiant unique du nœud Person dans le graphe JSON-LD.
 *  Dérivé de SEO_DOMAIN pour ne jamais dupliquer l'URL en dur. */
export const SEO_PERSON_ID = `${SEO_DOMAIN}/#person` as const;

/** Identifiant unique du nœud WebSite dans le graphe JSON-LD.
 *  Permet aux autres nœuds (ex: author) de référencer ce site par `@id`. */
export const SEO_WEBSITE_ID = `${SEO_DOMAIN}/#website` as const;

/** Adresse email de contact */
export const SEO_EMAIL = "johtandou@gmail.com" as const;

/** Nom complet affiché dans les métadonnées */
export const SEO_NAME = "Joh Tandou" as const;

/** Intitulé exact du poste — utilisé dans JSON-LD, OG et meta */
export const SEO_JOB_TITLE = "Software Engineer — Java & Web" as const;

// ─── Réseaux sociaux (sameAs schema.org) ─────────────────────────────

/** Profils sociaux listés dans le structured data Person.
 *  Liste exhaustive — ne pas ajouter de profil sans décision explicite. */
export const SEO_SAME_AS = {
  linkedin: "https://www.linkedin.com/in/johtandou/",
  github: "https://github.com/JohTandou",
} as const;

/** Version tableau pour injection directe dans JSON-LD */
export const SEO_SAME_AS_LIST: readonly string[] = Object.values(SEO_SAME_AS);

// ─── Langues parlées ─────────────────────────────────────────────────

/** Langues déclarées dans le structured data Person (ordre alphabétique) */
export const SEO_LANGUAGES = ["English", "French", "Spanish"] as const;

/** Type extrait pour usage typé */
export type SeoLanguage = (typeof SEO_LANGUAGES)[number];

// ─── Open Graph — image de partage ───────────────────────────────────

/** Configuration de l'image Open Graph.
 *  Utilise l'image hero existante pour la cohérence visuelle.
 *  URL relative car toujours sur le même domaine. */
export const OG_IMAGE = {
  /** Chemin de l'image de partage (image hero du site) */
  url: "/backgrounds/hero.jpg" as const,
  /** Largeur en pixels (standard OG) */
  width: 1200,
  /** Hauteur en pixels (standard OG) */
  height: 630,
  /** Texte alternatif pour l'image */
  alt: "Joh Tandou — Software Engineer Java & Web",
} as const;

// ─── Structured Data Types (schema.org) ──────────────────────────────

/** @see https://schema.org/Person
 *  Contient uniquement les champs explicitement demandés —
 *  pas d'hypothèse sur l'adresse, les diplômes ou les compétences. */
export interface PersonStructuredData {
  "@type": "Person";
  /** Identifiant unique du nœud Person dans le graphe,
   *  permettant à d'autres nœuds (ex: WebSite.author) de le référencer. */
  "@id": string;
  name: string;
  jobTitle: string;
  url: string;
  email: string;
  /** Profils LinkedIn et GitHub (liste exhaustive) */
  sameAs: readonly string[];
  /** Langues parlées : English, French, Spanish */
  knowsLanguage: readonly string[];
}

/** @see https://schema.org/WebSite
 *  Données factuelles décrivant le site portfolio lui-même.
 *  `author` est une référence par `@id` vers le nœud Person du graphe,
 *  ce qui évite de dupliquer les données de la personne. */
export interface WebSiteStructuredData {
  "@type": "WebSite";
  /** Identifiant unique du nœud WebSite dans le graphe */
  "@id": string;
  /** Nom du site tel qu'affiché dans les SERP */
  name: string;
  /** URL canonique */
  url: string;
  /** Description du site (fournie par l'appelant) */
  description: string;
  /** Langue principale du contenu */
  inLanguage: string;
  /** Auteur du site — référence vers le nœud Person par `@id` */
  author: {
    "@id": string;
  };
}

/** Graphe JSON-LD complet injecté dans le <head> */
export interface SeoGraph {
  "@context": "https://schema.org";
  "@graph": [PersonStructuredData, WebSiteStructuredData];
}

// ─── Structured Data Builders ────────────────────────────────────────

/** Construit l'objet Person (schema.org) avec toutes les données factuelles.
 *  Aucune surcharge possible par défaut — les données sont verrouillées.
 *  Le paramètre `overrides` permet d'ajuster des champs sans dupliquer
 *  les constantes. */
export function buildPersonStructuredData(
  overrides?: Partial<PersonStructuredData>
): PersonStructuredData {
  return {
    "@type": "Person",
    "@id": SEO_PERSON_ID,
    name: SEO_NAME,
    jobTitle: SEO_JOB_TITLE,
    url: SEO_DOMAIN,
    email: SEO_EMAIL,
    sameAs: SEO_SAME_AS_LIST,
    knowsLanguage: SEO_LANGUAGES,
    ...overrides,
  };
}

/** Construit l'objet WebSite (schema.org).
 *  La description est obligatoire car elle dépend du contexte de la page. */
export function buildWebSiteStructuredData(
  description: string
): WebSiteStructuredData {
  return {
    "@type": "WebSite",
    "@id": SEO_WEBSITE_ID,
    name: "Joh Tandou Portfolio",
    url: SEO_DOMAIN,
    description,
    inLanguage: "fr",
    author: {
      "@id": SEO_PERSON_ID,
    },
  };
}

/** Construit le graphe JSON-LD complet (Person + WebSite)
 *  prêt à être sérialisé avec JSON.stringify(). */
export function buildSeoGraph(websiteDescription: string): SeoGraph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildPersonStructuredData(),
      buildWebSiteStructuredData(websiteDescription),
    ],
  };
}
