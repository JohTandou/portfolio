import { describe, it, expect } from "vitest";
import {
  SEO_DOMAIN,
  SEO_PERSON_ID,
  SEO_WEBSITE_ID,
  buildPersonStructuredData,
  buildWebSiteStructuredData,
  buildSeoGraph,
} from "../seo";

/* ============================================================
   Tests unitaires — @id JSON-LD Person / WebSite
   Vérifie l'ajout des identifiants uniques des nœuds du graphe,
   la référence WebSite.author → Person par `@id`, la cohérence
   d'entité et l'absence de Person dupliqué (inline) dans author.
   ============================================================ */

const DESCRIPTION =
  "Portfolio de Joh Tandou — expériences interactives et solutions logicielles sur mesure.";

/* ------------------------------------------------------------------ */
/* 1. Dérivation des identifiants depuis SEO_DOMAIN                    */
/* ------------------------------------------------------------------ */
describe("SEO @id constants — dérivation depuis SEO_DOMAIN", () => {
  it('should derive SEO_PERSON_ID as "<domain>/#person"', () => {
    expect(SEO_PERSON_ID).toBe("https://jtandou.dev/#person");
    expect(SEO_PERSON_ID).toBe(`${SEO_DOMAIN}/#person`);
  });

  it('should derive SEO_WEBSITE_ID as "<domain>/#website"', () => {
    expect(SEO_WEBSITE_ID).toBe("https://jtandou.dev/#website");
    expect(SEO_WEBSITE_ID).toBe(`${SEO_DOMAIN}/#website`);
  });

  it("should keep Person and WebSite identifiers distinct", () => {
    expect(SEO_PERSON_ID).not.toBe(SEO_WEBSITE_ID);
  });
});

/* ------------------------------------------------------------------ */
/* 2. Person @id                                                       */
/* ------------------------------------------------------------------ */
describe("Person @id", () => {
  it("should expose @id equal to SEO_PERSON_ID", () => {
    const person = buildPersonStructuredData();
    expect(person["@id"]).toBe(SEO_PERSON_ID);
  });

  it("should keep @id stable when overrides are applied", () => {
    const person = buildPersonStructuredData({ name: "Custom Name" });
    expect(person["@id"]).toBe(SEO_PERSON_ID);
  });
});

/* ------------------------------------------------------------------ */
/* 3. WebSite @id                                                      */
/* ------------------------------------------------------------------ */
describe("WebSite @id", () => {
  it("should expose @id equal to SEO_WEBSITE_ID", () => {
    const site = buildWebSiteStructuredData(DESCRIPTION);
    expect(site["@id"]).toBe(SEO_WEBSITE_ID);
  });

  it("should keep @id distinct from the Person @id", () => {
    const site = buildWebSiteStructuredData(DESCRIPTION);
    expect(site["@id"]).not.toBe(SEO_PERSON_ID);
  });
});

/* ------------------------------------------------------------------ */
/* 4. WebSite.author — référence pure (aucun Person inline)            */
/* ------------------------------------------------------------------ */
describe("WebSite.author — référence pure vers Person", () => {
  it("should strictly equal { @id: SEO_PERSON_ID }", () => {
    const site = buildWebSiteStructuredData(DESCRIPTION);
    expect(site.author).toEqual({ "@id": SEO_PERSON_ID });
  });

  it("should expose exactly one key (@id) — no inline Person fields", () => {
    const site = buildWebSiteStructuredData(DESCRIPTION);
    expect(Object.keys(site.author)).toEqual(["@id"]);
  });

  it("should NOT inline any Person data field in author", () => {
    const site = buildWebSiteStructuredData(DESCRIPTION);
    const author = site.author as Record<string, unknown>;
    expect(author).not.toHaveProperty("@type");
    expect(author).not.toHaveProperty("name");
    expect(author).not.toHaveProperty("jobTitle");
    expect(author).not.toHaveProperty("url");
    expect(author).not.toHaveProperty("email");
    expect(author).not.toHaveProperty("sameAs");
    expect(author).not.toHaveProperty("knowsLanguage");
  });
});

/* ------------------------------------------------------------------ */
/* 5. Cohérence d'entité dans le graphe complet                        */
/* ------------------------------------------------------------------ */
describe("Graphe JSON-LD — cohérence d'entité", () => {
  it("should have website.author[@id] === person[@id]", () => {
    const graph = buildSeoGraph(DESCRIPTION);
    const person = graph["@graph"][0];
    const website = graph["@graph"][1];
    expect(website.author["@id"]).toBe(person["@id"]);
  });

  it("should point both @id to the SEO constants", () => {
    const graph = buildSeoGraph(DESCRIPTION);
    const person = graph["@graph"][0];
    const website = graph["@graph"][1];
    expect(person["@id"]).toBe(SEO_PERSON_ID);
    expect(website["@id"]).toBe(SEO_WEBSITE_ID);
    expect(website.author["@id"]).toBe(SEO_PERSON_ID);
  });

  it("should serialise author as a reference only", () => {
    const graph = buildSeoGraph(DESCRIPTION);
    const parsed = JSON.parse(JSON.stringify(graph));
    expect(parsed["@graph"][1].author).toEqual({ "@id": SEO_PERSON_ID });
    expect(Object.keys(parsed["@graph"][1].author)).toEqual(["@id"]);
  });
});
