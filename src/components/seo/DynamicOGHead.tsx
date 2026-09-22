import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { usePersona } from "@/context/PersonaContext";
import { getOptimalSEO } from "@/lib/seo-keywords";
import { coLivingItemListSchema, coLivingSpacesSchema } from "@/lib/seo-coliving-schema";

export function DynamicOGHead() {
  const { role } = usePersona();
  const routerState = useRouterState();
  const pathname = routerState?.location?.pathname || "/";
  const search = routerState?.location?.searchStr || "";
  const hash = routerState?.location?.hash || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const seo = getOptimalSEO(pathname, search, hash, role);

    // 1. Update Document Title
    document.title = seo.title;

    // Helper to safely update or insert meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper for link rel="canonical"
    const setCanonicalLink = (url: string) => {
      let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }
      element.setAttribute("href", url);
    };

    // 2. Standard Meta Description & Keywords
    setMetaTag('meta[name="description"]', "name", "description", seo.description);
    setMetaTag('meta[name="keywords"]', "name", "keywords", seo.keywords);

    // 3. OpenGraph Tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", seo.title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", seo.description);
    setMetaTag('meta[property="og:image"]', "property", "og:image", seo.ogImage);
    setMetaTag('meta[property="og:url"]', "property", "og:url", seo.canonicalUrl);

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", seo.description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", seo.ogImage);

    // 5. Canonical Link
    setCanonicalLink(seo.canonicalUrl);

    // 6. Dynamic Co-Living Spaces JSON-LD Schema
    const roomsJsonLdId = "coliving-rooms-jsonld";
    let scriptElement = document.getElementById(roomsJsonLdId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = roomsJsonLdId;
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }
    scriptElement.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [coLivingItemListSchema, ...coLivingSpacesSchema],
    });
  }, [role, pathname, search, hash]);

  return null;
}
