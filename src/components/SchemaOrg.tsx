import { CONTACT_PHONE_SCHEMA } from '@/lib/contact';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  slug: string;
  sku?: string;
  price: number;
  category?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

const SITE_URL = 'https://aquails.com';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Aquails',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/brand/logo.png`,
    },
    description: 'Su arıtma cihazları, filtre setleri ve servis çözümleri',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_PHONE_SCHEMA,
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: ['tr'],
    },
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Aquails',
    url: SITE_URL,
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    inLanguage: 'tr-TR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/arama?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getProductSchema({
  name,
  description,
  image,
  slug,
  sku,
  price,
  category = 'Su Arıtma Cihazı',
  availability = 'InStock',
}: ProductSchemaProps) {
  const productUrl = `${SITE_URL}/urun/${slug}`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    url: productUrl,
    name,
    description,
    image: [image.startsWith('http') ? image : `${SITE_URL}${image}`],
    brand: {
      '@type': 'Brand',
      name: 'Aquails',
    },
    category,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'TRY',
      price: Number(price.toFixed(2)),
      availability: `https://schema.org/${availability}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': ORGANIZATION_ID,
      },
    },
  };

  if (sku) schema.sku = sku;

  return schema;
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getArticleSchema({
  title,
  description,
  slug,
  image,
  datePublished,
  dateModified,
}: ArticleSchemaProps) {
  const url = `${SITE_URL}/blog/${slug}`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@id': ORGANIZATION_ID,
    },
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    inLanguage: 'tr-TR',
  };

  if (image) {
    schema.image = [image.startsWith('http') ? image : `${SITE_URL}${image}`];
  }
  if (datePublished) schema.datePublished = datePublished;
  if (dateModified) schema.dateModified = dateModified;

  return schema;
}

export function getFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Aquails',
    description: 'Su arıtma cihazları, filtre setleri ve servis çözümleri',
    url: SITE_URL,
    telephone: CONTACT_PHONE_SCHEMA,
    email: 'info@aquails.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İstanbul',
      addressCountry: 'TR',
    },
    parentOrganization: {
      '@id': ORGANIZATION_ID,
    },
  };
}
