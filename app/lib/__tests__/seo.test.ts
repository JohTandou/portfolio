import { describe, it, expect } from "vitest";
import {
  SEO_DOMAIN,
  SEO_EMAIL,
  SEO_NAME,
  SEO_JOB_TITLE,
  SEO_SAME_AS,
  SEO_SAME_AS_LIST,
  SEO_LANGUAGES,
  OG_IMAGE,
  buildPersonStructuredData,
  buildWebSiteStructuredData,
  buildSeoGraph,
} from "../seo";

/* ============================================================
   Tests unitaires — app/lib/seo.ts
   Vérifie les constantes d'identité, les builders JSON-LD
   et la config d'image Open Graph.
   ============================================================ */

/* ------------------------------------------------------------------ */
/* 1. Constantes d'identité                                            */
/* ------------------------------------------------------------------ */
describe("SEO identity constants", () => {
  it('should have SEO_DOMAIN as "https://jtandou.dev"', () => {
    expect(SEO_DOMAIN).toBe("https://jtandou.dev");
  });

  it('should have SEO_EMAIL as "johtandou@gmail.com"', () => {
    expect(SEO_EMAIL).toBe("johtandou@gmail.com");
  });

  it('should have SEO_NAME as "Joh Tandou"', () => {
    expect(SEO_NAME).toBe("Joh Tandou");
  });

  it('should have SEO_JOB_TITLE as "Software Engineer — Java & Web"', () => {
    expect(SEO_JOB_TITLE).toBe("Software Engineer — Java & Web");
  });
});

/* ------------------------------------------------------------------ */
/* 2. Réseaux sociaux — sameAs                                         */
/* ------------------------------------------------------------------ */
describe("SEO_SAME_AS", () => {
  it("should contain LinkedIn profile URL", () => {
    expect(SEO_SAME_AS.linkedin).toBe(
      "https://www.linkedin.com/in/johtandou/"
    );
  });

  it("should contain GitHub profile URL", () => {
    expect(SEO_SAME_AS.github).toBe("https://github.com/JohTandou");
  });

  it("should have exactly two social profiles (LinkedIn + GitHub)", () => {
    expect(Object.keys(SEO_SAME_AS)).toHaveLength(2);
  });

  it("should expose a matching readonly array in SEO_SAME_AS_LIST", () => {
    expect(SEO_SAME_AS_LIST).toEqual([
      "https://www.linkedin.com/in/johtandou/",
      "https://github.com/JohTandou",
    ]);
  });
});

/* ------------------------------------------------------------------ */
/* 3. Langues                                                          */
/* ------------------------------------------------------------------ */
describe("SEO_LANGUAGES", () => {
  it("should contain English, French and Spanish", () => {
    expect(SEO_LANGUAGES).toEqual(["English", "French", "Spanish"]);
  });

  it("should have exactly three languages", () => {
    expect(SEO_LANGUAGES).toHaveLength(3);
  });
});

/* ------------------------------------------------------------------ */
/* 4. OG_IMAGE — configuration de l'image de partage                   */
/* ------------------------------------------------------------------ */
describe("OG_IMAGE", () => {
  it('should have url "/backgrounds/hero.jpg"', () => {
    expect(OG_IMAGE.url).toBe("/backgrounds/hero.jpg");
  });

  it("should have width 1200 and height 630", () => {
    expect(OG_IMAGE.width).toBe(1200);
    expect(OG_IMAGE.height).toBe(630);
  });

  it("should have a descriptive alt text containing the name", () => {
    expect(OG_IMAGE.alt).toContain("Joh Tandou");
    expect(OG_IMAGE.alt).toContain("Software Engineer");
  });
});

/* ------------------------------------------------------------------ */
/* 5. buildPersonStructuredData()                                      */
/* ------------------------------------------------------------------ */
describe("buildPersonStructuredData", () => {
  it("should return a Person object with @type", () => {
    const person = buildPersonStructuredData();
    expect(person["@type"]).toBe("Person");
  });

  it("should use SEO_NAME and SEO_JOB_TITLE", () => {
    const person = buildPersonStructuredData();
    expect(person.name).toBe(SEO_NAME);
    expect(person.jobTitle).toBe(SEO_JOB_TITLE);
  });

  it("should use SEO_DOMAIN as url and SEO_EMAIL as email", () => {
    const person = buildPersonStructuredData();
    expect(person.url).toBe(SEO_DOMAIN);
    expect(person.email).toBe(SEO_EMAIL);
  });

  it("should include LinkedIn and GitHub in sameAs", () => {
    const person = buildPersonStructuredData();
    expect(person.sameAs).toContain(SEO_SAME_AS.linkedin);
    expect(person.sameAs).toContain(SEO_SAME_AS.github);
    expect(person.sameAs).toHaveLength(2);
  });

  it("should include English, French and Spanish in knowsLanguage", () => {
    const person = buildPersonStructuredData();
    expect(person.knowsLanguage).toContain("English");
    expect(person.knowsLanguage).toContain("French");
    expect(person.knowsLanguage).toContain("Spanish");
  });

  it("should NOT contain Spring, JPA, Hibernate or microservices", () => {
    const person = buildPersonStructuredData();
    const json = JSON.stringify(person).toLowerCase();
    expect(json).not.toContain("spring");
    expect(json).not.toContain("jpa");
    expect(json).not.toContain("hibernate");
    expect(json).not.toContain("microservices");
  });

  it("should NOT contain address, alumniOf or knowsAbout fields", () => {
    const person = buildPersonStructuredData();
    expect(person).not.toHaveProperty("address");
    expect(person).not.toHaveProperty("alumniOf");
    expect(person).not.toHaveProperty("knowsAbout");
  });

  it("should merge overrides correctly", () => {
    const person = buildPersonStructuredData({
      name: "Custom Name",
      jobTitle: "Custom Title",
    });
    expect(person.name).toBe("Custom Name");
    expect(person.jobTitle).toBe("Custom Title");
    /* Unchanged fields remain */
    expect(person.url).toBe(SEO_DOMAIN);
    expect(person.email).toBe(SEO_EMAIL);
    expect(person["@type"]).toBe("Person");
  });
});

/* ------------------------------------------------------------------ */
/* 6. buildWebSiteStructuredData()                                     */
/* ------------------------------------------------------------------ */
describe("buildWebSiteStructuredData", () => {
  it("should return a WebSite object with @type", () => {
    const site = buildWebSiteStructuredData("Test description");
    expect(site["@type"]).toBe("WebSite");
  });

  it('should have name "Joh Tandou Portfolio"', () => {
    const site = buildWebSiteStructuredData("Test");
    expect(site.name).toBe("Joh Tandou Portfolio");
  });

  it("should use SEO_DOMAIN as url", () => {
    const site = buildWebSiteStructuredData("Test");
    expect(site.url).toBe(SEO_DOMAIN);
  });

  it("should use the provided description", () => {
    const desc = "Portfolio interactif de Joh Tandou";
    const site = buildWebSiteStructuredData(desc);
    expect(site.description).toBe(desc);
  });

  it('should have inLanguage "fr"', () => {
    const site = buildWebSiteStructuredData("Test");
    expect(site.inLanguage).toBe("fr");
  });

  it("should have author as Person with SEO_NAME", () => {
    const site = buildWebSiteStructuredData("Test");
    expect(site.author["@type"]).toBe("Person");
    expect(site.author.name).toBe(SEO_NAME);
  });
});

/* ------------------------------------------------------------------ */
/* 7. buildSeoGraph()                                                  */
/* ------------------------------------------------------------------ */
describe("buildSeoGraph", () => {
  const description =
    "Portfolio de Joh Tandou — expériences interactives et solutions logicielles sur mesure.";

  it("should have @context as https://schema.org", () => {
    const graph = buildSeoGraph(description);
    expect(graph["@context"]).toBe("https://schema.org");
  });

  it("should contain exactly two items in @graph (Person + WebSite)", () => {
    const graph = buildSeoGraph(description);
    expect(graph["@graph"]).toHaveLength(2);
  });

  it("should have first item as Person", () => {
    const graph = buildSeoGraph(description);
    expect(graph["@graph"][0]["@type"]).toBe("Person");
  });

  it("should have second item as WebSite", () => {
    const graph = buildSeoGraph(description);
    expect(graph["@graph"][1]["@type"]).toBe("WebSite");
  });

  it("should serialise to valid JSON", () => {
    const graph = buildSeoGraph(description);
    const json = JSON.stringify(graph);
    const parsed = JSON.parse(json);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@graph"]).toHaveLength(2);
  });

  it("should NOT contain Spring, JPA, Hibernate, microservices in output", () => {
    const graph = buildSeoGraph(description);
    const json = JSON.stringify(graph).toLowerCase();
    expect(json).not.toContain("spring");
    expect(json).not.toContain("jpa");
    expect(json).not.toContain("hibernate");
    expect(json).not.toContain("microservices");
  });

  it("should NOT contain address, alumniOf or knowsAbout", () => {
    const graph = buildSeoGraph(description);
    const json = JSON.stringify(graph).toLowerCase();
    expect(json).not.toContain("address");
    expect(json).not.toContain("alumniof");
    expect(json).not.toContain("knowsabout");
  });

  it("should contain LinkedIn and GitHub sameAs URLs", () => {
    const graph = buildSeoGraph(description);
    const person = graph["@graph"][0];
    expect(person.sameAs).toContain(
      "https://www.linkedin.com/in/johtandou/"
    );
    expect(person.sameAs).toContain("https://github.com/JohTandou");
  });

  it("should contain French, English, Spanish languages", () => {
    const graph = buildSeoGraph(description);
    const person = graph["@graph"][0];
    expect(person.knowsLanguage).toEqual(
      expect.arrayContaining(["English", "French", "Spanish"])
    );
  });

  it("should contain email", () => {
    const graph = buildSeoGraph(description);
    const person = graph["@graph"][0];
    expect(person.email).toBe("johtandou@gmail.com");
  });
});
