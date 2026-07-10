#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CATEGORY_CONFIG, classifyProduct } from './category-rules.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsPath = resolve(__dirname, '../src/data/products.ts');

const slugToCat = Object.fromEntries(CATEGORY_CONFIG.map((c) => [c.slug, c]));

let content = readFileSync(productsPath, 'utf8');

// Update each product's category fields
content = content.replace(
  /"slug": "([^"]+)",\s*\n\s*"name": "([^"]+)"/g,
  (match, slug, name) => {
    const catSlug = classifyProduct(slug, name);
    const cat = slugToCat[catSlug];
    return match; // only used to find products - we'll do a second pass
  },
);

// Per-product block updates
const productBlocks = content.match(/\{[\s\S]*?"categorySlug": "[^"]+"[\s\S]*?\}/g) ?? [];
for (const block of productBlocks) {
  const slugMatch = block.match(/"slug": "([^"]+)"/);
  const nameMatch = block.match(/"name": "([^"]+)"/);
  if (!slugMatch) continue;
  const catSlug = classifyProduct(slugMatch[1], nameMatch?.[1] ?? '');
  const cat = slugToCat[catSlug];
  if (!cat) continue;

  let updated = block
    .replace(/"category": "[^"]*"/, `"category": "${cat.name}"`)
    .replace(/"subcategory": "[^"]*"/, `"subcategory": "${cat.name}"`)
    .replace(/"categorySlug": "[^"]*"/, `"categorySlug": "${cat.slug}"`)
    .replace(/"Kategori": "[^"]*"/, `"Kategori": "${cat.name}"`);

  content = content.replace(block, updated);
}

// Rebuild categories export
const counts = {};
for (const cat of CATEGORY_CONFIG) counts[cat.slug] = 0;
const slugMatches = [...content.matchAll(/"categorySlug": "([^"]+)"/g)];
for (const m of slugMatches) {
  if (counts[m[1]] !== undefined) counts[m[1]]++;
}

const categoriesJson = CATEGORY_CONFIG.map((c) => ({
  id: c.slug,
  name: c.name,
  description: `${c.name} kategorisi`,
  productCount: counts[c.slug] || 0,
  icon: c.icon,
}));

const catExport = `export const categories = ${JSON.stringify(categoriesJson, null, 2)};`;
content = content.replace(/export const categories = \[[\s\S]*?\];/, catExport);

writeFileSync(productsPath, content);
console.log('Updated products.ts categories:');
for (const c of CATEGORY_CONFIG) {
  console.log(`  ${c.name}: ${counts[c.slug] || 0}`);
}
