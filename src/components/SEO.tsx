import { useEffect } from 'react';

type JsonLdNode = Record<string, unknown>;

interface SEOProps {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  schema?: JsonLdNode | JsonLdNode[];
}

const DEFAULT_DESCRIPTION =
  'Aquails su arıtma cihazları, filtre setleri, servis randevusu ve filtre aboneliği çözümleriyle eviniz ve iş yeriniz için güvenilir su teknolojileri sunar.';
const DEFAULT_OG_IMAGE = '/images/brand/aquails-og.jpg';
export const SITE_URL = 'https://www.aquails.com';

function absoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value.startsWith('/') ? value : `/${value}`, SITE_URL).toString();
}

function toGraph(schema: JsonLdNode | JsonLdNode[]): JsonLdNode {
  if (!Array.isArray(schema)) return schema;

  const graph = schema.map((node) => {
    const { ['@context']: _context, ...rest } = node;
    return rest;
  });

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonical,
  noindex = false,
  schema,
}: SEOProps) {
  const fullTitle = title.includes('Aquails') ? title : `${title} | Aquails`;
  const fullOgTitle = ogTitle || fullTitle;
  const fullOgDesc = ogDescription || description;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (
      selector: string,
      content: string,
      attr: 'name' | 'property' = 'name',
    ) => {
      let el = document.querySelector(`meta[${attr}="${selector}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, selector);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const canonicalPath = canonical || window.location.pathname || '/';
    const canonicalUrl = absoluteUrl(canonicalPath);
    const imageUrl = absoluteUrl(ogImage);

    setMeta('description', description);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setMeta('googlebot', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    setMeta('og:title', fullOgTitle, 'property');
    setMeta('og:description', fullOgDesc, 'property');
    setMeta('og:image', imageUrl, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:site_name', 'Aquails', 'property');
    setMeta('og:locale', 'tr_TR', 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullOgTitle);
    setMeta('twitter:description', fullOgDesc);
    setMeta('twitter:image', imageUrl);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonicalUrl;

    const schemaId = 'aquails-schema-jsonld';
    const existingSchema = document.getElementById(schemaId);

    if (schema) {
      let scriptEl = existingSchema as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = schemaId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(toGraph(schema));
    } else {
      existingSchema?.remove();
    }
  }, [
    canonical,
    description,
    fullOgDesc,
    fullOgTitle,
    fullTitle,
    noindex,
    ogImage,
    ogType,
    schema,
  ]);

  return null;
}
