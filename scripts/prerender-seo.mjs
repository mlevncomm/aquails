import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SITE = 'https://www.aquails.com';
const DIST = path.resolve('dist');
const categoryMeta = {
  'direkt-akis-ro': ['Direkt Akış Su Arıtma Cihazları | Aquails', 'Aquails direkt akış ters ozmoz su arıtma cihazlarını inceleyin. Tanksız ve yüksek kapasiteli RO sistemlerini özelliklerine göre karşılaştırın.'],
  'klasik-ro-sistemleri': ['Klasik RO Su Arıtma Cihazları | Aquails', 'Tanklı klasik ters ozmoz su arıtma cihazlarını keşfedin. Ev tipi RO sistemlerini filtre yapısı, kapasite ve özelliklerine göre karşılaştırın.'],
  'soft-kompakt': ['Kompakt Su Arıtma Sistemleri | Aquails', 'Kompakt ve modern su arıtma sistemlerini inceleyin. Alan tasarrufu sağlayan Aquails su arıtma çözümlerini özelliklerine göre karşılaştırın.'],
  'sebiller': ['Arıtmalı Su Sebilleri ve Sebil Sistemleri | Aquails', 'Aquails arıtmalı su sebilleri ve sebil çözümlerini keşfedin. Ev ve iş yeri kullanımına uygun modelleri ve sebil aparatlarını karşılaştırın.'],
  'bina-giris-filtrasyon': ['Bina Giriş Su Filtrasyon Sistemleri | Aquails', 'Bina ve daire girişinde kullanılan su filtrasyon sistemlerini inceleyin. Tortu ve partikül filtrasyonu için Aquails çözümlerini keşfedin.'],
  'filtreler-membranlar': ['Su Arıtma Filtreleri ve Membranlar | Aquails', 'Su arıtma filtresi, RO membran, karbon ve mineral filtre seçeneklerini inceleyin. Aquails filtre ve membran ürünlerini kolayca karşılaştırın.'],
  'musluklar-aksesuarlar': ['Su Arıtma Muslukları ve Aksesuarları | Aquails', 'Su arıtma muslukları, bağlantı ve sistem aksesuarlarını inceleyin. Aquails uyumlu musluk ve tamamlayıcı parçaları keşfedin.']
};

function clean(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
function short(value, max = 158) {
  const v = clean(value);
  return v.length > max ? v.slice(0, max - 1).trim() + '…' : v;
}
function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fallbackMarkup(data) {
  if (!data?.heading || !data?.description) return '';
  const links = (data.links || [])
    .map((link) => '<a href="' + esc(link.href) + '">' + esc(link.label) + '</a>')
    .join(' · ');
  return [
    '<main data-aquails-seo-fallback style="max-width:72rem;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif">',
    '<h1>' + esc(data.heading) + '</h1>',
    '<p>' + esc(data.description) + '</p>',
    links ? '<nav aria-label="İlgili sayfalar">' + links + '</nav>' : '',
    '</main>'
  ].join('');
}
function meta(html, attr, key, value) {
  const re = new RegExp('<meta\\s+' + attr + '="' + key + '"\\s+content="[^"]*"\\s*\\/?>', 'i');
  const tag = '<meta ' + attr + '="' + key + '" content="' + esc(value) + '" />';
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', '    ' + tag + '\n  </head>');
}
function inject(template, data) {
  let html = template.replace(/<title>[^<]*<\/title>/i, '<title>' + esc(data.title) + '</title>');
  html = meta(html, 'name', 'description', data.description);
  html = meta(html, 'property', 'og:title', data.title);
  html = meta(html, 'property', 'og:description', data.description);
  html = meta(html, 'property', 'og:url', data.canonical);
  html = meta(html, 'property', 'og:type', data.type || 'website');
  if (data.image) html = meta(html, 'property', 'og:image', data.image);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, '');
  html = html.replace('</head>', '    <link rel="canonical" href="' + esc(data.canonical) + '" />\n  </head>');
  const schema = '<script id="aquails-schema-jsonld" type="application/ld+json">' + JSON.stringify(data.schema).replace(/</g, '\\u003c') + '</script>';
  html = html.replace(/<script id="aquails-schema-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/i, schema);
  const fallback = fallbackMarkup(data.fallback);
  if (fallback) html = html.replace('<div id="root"></div>', '<div id="root">' + fallback + '</div>');
  return html;
}
async function writeRoute(route, html) {
  const dir = path.join(DIST, route.replace(/^\/+/, ''));
  const file = path.join(dir, 'index.html');
  await mkdir(dir, { recursive: true });
  await writeFile(file, html, 'utf8');
}
function graph(nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
const org = { '@type': 'Organization', '@id': SITE + '/#organization', name: 'Aquails', url: SITE, logo: { '@type': 'ImageObject', url: SITE + '/images/brand/logo.png' } };
const site = { '@type': 'WebSite', '@id': SITE + '/#website', name: 'Aquails', url: SITE, publisher: { '@id': SITE + '/#organization' }, inLanguage: 'tr-TR' };
function crumbs(items) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: SITE + x.path })) };
}
function gross(price, tax) {
  const rate = Number.isFinite(Number(tax)) ? Number(tax) : 20;
  return Math.round(Number(price) * (1 + rate / 100) * 100) / 100;
}

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

await writeFile(path.join(DIST, 'index.html'), inject(template, {
  title: 'Aquails | Daha Temiz Su, Daha Akıllı Teknoloji',
  description: 'Aquails su arıtma cihazları, filtre setleri, servis randevusu ve filtre aboneliği çözümleriyle eviniz ve iş yeriniz için güvenilir su teknolojileri sunar.',
  canonical: SITE + '/',
  schema: graph([org, site, {
    '@type': 'WebPage',
    '@id': SITE + '/#webpage',
    url: SITE + '/',
    name: 'Aquails | Daha Temiz Su, Daha Akıllı Teknoloji',
    description: 'Aquails su arıtma cihazları, filtre setleri, servis randevusu ve filtre aboneliği çözümleriyle eviniz ve iş yeriniz için güvenilir su teknolojileri sunar.',
    inLanguage: 'tr-TR',
    isPartOf: { '@id': SITE + '/#website' }
  }]),
  fallback: {
    heading: 'Su Arıtma Cihazları ve Filtre Çözümleri',
    description: 'Aquails; ev ve iş yerleri için su arıtma cihazları, filtre çözümleri, servis ve bakım hizmetleri sunar.',
    links: [
      { href: '/urunler', label: 'Su arıtma ürünleri' },
      { href: '/blog', label: 'Su arıtma rehberi' },
      { href: '/servis-randevusu', label: 'Servis randevusu' },
      { href: '/iletisim', label: 'İletişim' }
    ]
  }
}), 'utf8');

const staticMeta = {
  '/urunler': [
    'Aquails Ürünleri | Su Arıtma Cihazları ve Filtreler',
    'Aquails su arıtma cihazları, filtre setleri, tezgah altı sistemler ve arıtma çözümleri. Ürünleri karşılaştırın, ihtiyacınıza uygun sistemi keşfedin.',
  ],
  '/kampanyalar': [
    'Aquails Kampanyaları | Su Arıtma Fırsatları',
    'Aquails kampanyaları ve indirim fırsatları. Su arıtma cihazlarında özel fiyatları ve güncel avantajları inceleyin.',
  ],
  '/blog': [
    'Aquails Blog | Su Arıtma Rehberi ve Filtre Bakımı',
    'Su arıtma teknolojileri, filtre bakımı, su kalitesi ve sağlıklı yaşam hakkında kapsamlı rehberler ve bilgilendirici yazılar.',
  ],
  '/filtre-aboneligi': [
    'Filtre Aboneliği | Aquails',
    'Aquails filtre aboneliği ile filtre değişim planınızı düzenli takip edin ve uygun filtre çözümlerine kolayca ulaşın.',
  ],
  '/servis-randevusu': [
    'Aquails Servis Randevusu | Kurulum ve Filtre Değişimi',
    'Aquails servis randevusu oluşturun. Kurulum, filtre değişimi, bakım ve teknik servis taleplerinizi iletin.',
  ],
  '/urun-secim-sihirbazi': [
    'Ürün Seçim Sihirbazı | Aquails',
    'Birkaç soruya cevap vererek eviniz veya iş yeriniz için ihtiyaçlarınıza uygun Aquails su arıtma cihazlarını keşfedin.',
  ],
  '/filtre-hesaplayici': [
    'Filtre Değişim Hesaplayıcı | Aquails',
    'Aquails filtre değişim sürenizi hesaplayın. Cihaz modeli ve kullanım bilgilerinize göre filtre bakım zamanınızı planlayın.',
  ],
  '/su-kalitesi-testi': [
    'Su Kalitesi Testi | Aquails',
    'Suyunuzun TDS değeri ve kullanım ihtiyacına göre su kalitesi hakkında bilgi edinin ve uygun arıtma seçeneklerini keşfedin.',
  ],
  '/servis-agimiz': [
    'Aquails Servis Ağı | Kurulum ve Bakım',
    'Aquails servis ağı hakkında bilgi alın. Su arıtma cihazı kurulumu, bakım ve teknik servis seçeneklerini inceleyin.',
  ],
  '/filtre-secim-rehberi': [
    'Filtre Seçim Rehberi | Aquails',
    'Aquails filtre seçim rehberi ile cihazınıza ve kullanım ihtiyacınıza uygun filtre ve membran seçeneklerini keşfedin.',
  ],
  '/hakkimizda': [
    'Hakkımızda | Aquails',
    'Aquails su arıtma teknolojileri, filtre çözümleri ve servis hizmetleriyle ev ve işletmeler için temiz su çözümleri geliştirir.',
  ],
  '/iletisim': [
    'İletişim | Aquails',
    'Aquails iletişim bilgileri. Su arıtma cihazları, ürün seçimi, servis ve destek talepleriniz için bize ulaşın.',
  ],
  '/sss': [
    'Sıkça Sorulan Sorular | Aquails',
    'Aquails su arıtma cihazları hakkında sık sorulan soruların yanıtlarını; kurulum, filtre değişimi, servis ve kullanım başlıklarında inceleyin.',
  ],
};

for (const [route, values] of Object.entries(staticMeta)) {
  const canonical = SITE + route;
  await writeRoute(route, inject(template, {
    title: values[0],
    description: values[1],
    canonical,
    schema: graph([
      org,
      site,
      {
        '@type': route === '/urunler' || route === '/blog' ? 'CollectionPage' : 'WebPage',
        '@id': canonical + '#webpage',
        url: canonical,
        name: values[0],
        description: values[1],
        inLanguage: 'tr-TR',
        isPartOf: { '@id': SITE + '/#website' },
      },
    ]),
    fallback: {
      heading: values[0].replace(/\s+\|\s+Aquails.*$/, ''),
      description: values[1],
      links: [
        { href: '/urunler', label: 'Ürünler' },
        { href: '/blog', label: 'Blog' },
        { href: '/iletisim', label: 'İletişim' }
      ]
    }
  }));
}

for (const [slug, values] of Object.entries(categoryMeta)) {
  const canonical = SITE + '/kategori/' + slug;
  await writeRoute('/kategori/' + slug, inject(template, {
    title: values[0],
    description: values[1],
    canonical,
    schema: graph([org, site, { '@type': 'CollectionPage', '@id': canonical + '#collection', url: canonical, name: values[0], description: values[1], inLanguage: 'tr-TR' }]),
    fallback: {
      heading: values[0].replace(/\s+\|\s+Aquails.*$/, ''),
      description: values[1],
      links: [
        { href: '/urunler', label: 'Tüm ürünler' },
        { href: '/blog', label: 'Su arıtma rehberi' }
      ]
    }
  }));
}

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  if (process.env.VERCEL) throw new Error('SEO prerender requires Supabase env variables.');
  console.warn('[prerender-seo] Supabase env missing; category pages generated only.');
  process.exit(0);
}
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const [pr, br] = await Promise.all([
  db.from('products').select('*, categories(*), product_images(*)').eq('is_active', true),
  db.from('blog_posts').select('*').eq('status', 'published')
]);
if (pr.error) throw pr.error;
if (br.error) throw br.error;

for (const p of pr.data || []) {
  if (!p.slug || /http|:\/\//i.test(p.slug) || /(^|-)kopya(?:-\d+)?$/i.test(p.slug)) continue;
  const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
  const catName = cat?.name || 'Su Arıtma Ürünleri';
  const catSlug = cat?.slug || '';
  const description = short(p.short_description || p.description || p.name);
  const imgs = [...(p.product_images || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const image = imgs[0]?.url || SITE + '/images/products/placeholder.jpg';
  const canonical = SITE + '/urun/' + p.slug;
  const nodes = [
    org,
    site,
    {
      '@type': 'Product',
      '@id': canonical + '#product',
      url: canonical,
      name: p.name,
      description,
      image: [image.startsWith('http') ? image : SITE + image],
      sku: p.sku || undefined,
      brand: { '@type': 'Brand', name: 'Aquails' },
      category: catName,
      offers: {
        '@type': 'Offer',
        url: canonical,
        priceCurrency: 'TRY',
        price: gross(p.price, p.tax_rate),
        availability: 'https://schema.org/' + (Number(p.stock) > 0 ? 'InStock' : 'OutOfStock'),
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': SITE + '/#organization' }
      }
    }
  ];
  const trail = [{ name: 'Ana Sayfa', path: '/' }, { name: 'Ürünler', path: '/urunler' }];
  if (catSlug) trail.push({ name: catName, path: '/kategori/' + catSlug });
  trail.push({ name: p.name, path: '/urun/' + p.slug });
  nodes.push(crumbs(trail));
  await writeRoute('/urun/' + p.slug, inject(template, {
    title: p.name + ' | Aquails',
    description,
    canonical,
    type: 'product',
    image: image.startsWith('http') ? image : SITE + image,
    schema: graph(nodes),
    fallback: {
      heading: p.name,
      description,
      links: [
        { href: '/urunler', label: 'Tüm ürünler' },
        ...(catSlug ? [{ href: '/kategori/' + catSlug, label: catName }] : []),
        { href: '/iletisim', label: 'İletişim' }
      ]
    }
  }));
}

for (const post of br.data || []) {
  if (!post.slug) continue;
  const canonical = SITE + '/blog/' + post.slug;
  const description = short(post.content || post.title);
  const article = {
    '@type': 'Article',
    '@id': canonical + '#article',
    headline: post.title,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: { '@id': SITE + '/#organization' },
    publisher: { '@id': SITE + '/#organization' },
    datePublished: post.created_at,
    dateModified: post.updated_at,
    inLanguage: 'tr-TR'
  };
  await writeRoute('/blog/' + post.slug, inject(template, {
    title: post.title + ' | Aquails Blog',
    description,
    canonical,
    type: 'article',
    schema: graph([org, site, article, crumbs([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: '/blog/' + post.slug }
    ])]),
    fallback: {
      heading: post.title,
      description,
      links: [
        { href: '/blog', label: 'Tüm yazılar' },
        { href: '/urunler', label: 'Ürünler' }
      ]
    }
  }));
}

console.log('[prerender-seo] generated ' + (pr.data || []).length + ' product and ' + (br.data || []).length + ' blog pages.');
