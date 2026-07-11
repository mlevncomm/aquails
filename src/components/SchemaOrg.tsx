interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviewCount?: number;
  category?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

const SITE_URL = 'https://aquails.com';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aquails',
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/logo.png`,
    description: 'Daha Temiz Su, Daha Akıllı Teknoloji',
    sameAs: [
      'https://instagram.com/aquails',
      'https://facebook.com/aquails',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-500-123-4567',
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: 'Turkish',
    },
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Aquails',
    url: SITE_URL,
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
  sku,
  price,
  oldPrice,
  rating = 4.5,
  reviewCount = 24,
  category = 'Su Arıtma Cihazı',
  availability = 'InStock',
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image.startsWith('http') ? image : `${SITE_URL}${image}`,
    sku,
    brand: {
      '@type': 'Brand',
      name: 'Aquails',
    },
    category,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/urun/${sku.toLowerCase()}`,
      priceCurrency: 'TRY',
      price: price.toString(),
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Aquails',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };

  if (oldPrice && oldPrice > price) {
    (schema.offers as Record<string, unknown>).priceSpecification = {
      '@type': 'PriceSpecification',
      price: price.toString(),
      priceCurrency: 'TRY',
    };
    (schema.offers as Record<string, unknown>).priceValidUntil = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  }

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
    name: 'Aquails',
    description: 'Su arıtma cihazları, filtre setleri ve servis çözümleri',
    url: SITE_URL,
    telephone: '+90-500-123-4567',
    email: 'info@aquails.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Pendik',
      addressLocality: 'İstanbul',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.8780',
      longitude: '29.2566',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '₺₺',
  };
}
