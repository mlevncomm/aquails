import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  schema?: Record<string, unknown>;
}

const DEFAULT_DESCRIPTION = 'Aquails su arıtma cihazları, filtre setleri, servis randevusu ve filtre aboneliği çözümleriyle eviniz ve iş yeriniz için güvenilir su teknolojileri sunar.';
const DEFAULT_OG_IMAGE = '/images/brand/aquails-og.jpg';
const SITE_URL = 'https://aquails.com';

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
  const fullOgTitle = ogTitle || title;
  const fullOgDesc = ogDescription || description;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (selector: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${selector}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, selector);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setMeta('og:title', fullOgTitle, 'property');
    setMeta('og:description', fullOgDesc, 'property');
    setMeta('og:image', ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:site_name', 'Aquails', 'property');
    setMeta('og:locale', 'tr_TR', 'property');
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:title', fullOgTitle, 'name');
    setMeta('twitter:description', fullOgDesc, 'name');
    setMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`, 'name');
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    if (canonical) {
      let linkEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.rel = 'canonical';
        document.head.appendChild(linkEl);
      }
      linkEl.href = `${SITE_URL}${canonical}`;
    }

    // Schema
    if (schema) {
      const schemaId = 'aquails-schema-jsonld';
      let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = schemaId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    }

    return () => {
      // Cleanup schema on unmount
      if (!schema) {
        const schemaEl = document.getElementById('aquails-schema-jsonld');
        if (schemaEl) schemaEl.remove();
      }
    };
  }, [fullTitle, description, fullOgTitle, fullOgDesc, ogImage, ogType, canonical, noindex, schema]);

  return null;
}
