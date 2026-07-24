#!/usr/bin/env node
/**
 * Unit-style checks for product/admin helpers (no network, no DB).
 */
import assert from 'node:assert/strict';

function normalizeSlugJs(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ğüşıöç\s-]/gi, '')
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function validateForm(input) {
  if (!input.name.trim()) return 'Ürün adı zorunludur.';
  if (!input.slug.trim()) return 'Ürün adresi (slug) zorunludur.';
  if (!input.categoryId) return 'Kategori seçilmelidir.';
  if (!Number.isFinite(input.price) || input.price < 0) return 'Geçerli bir fiyat girin.';
  if (!Number.isFinite(input.stock) || input.stock < 0) return 'Geçerli bir stok değeri girin.';
  return null;
}

function validateImage(file) {
  const MAX = 5 * 1024 * 1024;
  const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  if (!file || file.size <= 0) return 'Geçersiz dosya.';
  if (file.size > MAX) return 'Görsel en fazla 5 MB olabilir.';
  if (!file.type || !ALLOWED.has(file.type)) return 'Yalnızca JPEG, PNG, WebP veya GIF yükleyebilirsiniz.';
  return null;
}

let passed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed += 1;
  } catch (e) {
    console.error(`✗ ${name}`);
    console.error(e);
    process.exitCode = 1;
  }
}

check('normalizeSlug lowercases and dashes', () => {
  assert.equal(normalizeSlugJs('Su Arıtma Cihazı'), 'su-aritma-cihazi');
});

check('validate rejects missing name/slug/category', () => {
  assert.ok(validateForm({ name: '', slug: 'x', categoryId: '1', price: 1, stock: 1 }));
  assert.ok(validateForm({ name: 'A', slug: '', categoryId: '1', price: 1, stock: 1 }));
  assert.ok(validateForm({ name: 'A', slug: 'a', categoryId: '', price: 1, stock: 1 }));
});

check('validate rejects negative price/stock/NaN', () => {
  assert.ok(validateForm({ name: 'A', slug: 'a', categoryId: '1', price: -1, stock: 1 }));
  assert.ok(validateForm({ name: 'A', slug: 'a', categoryId: '1', price: 1, stock: -1 }));
  assert.ok(validateForm({ name: 'A', slug: 'a', categoryId: '1', price: Number.NaN, stock: 1 }));
});

check('validate accepts valid form', () => {
  assert.equal(
    validateForm({ name: 'A', slug: 'a', categoryId: '1', price: 10, stock: 2 }),
    null,
  );
});

check('image rejects bad mime and oversized', () => {
  assert.ok(validateImage({ size: 10, type: 'application/pdf' }));
  assert.ok(validateImage({ size: 6 * 1024 * 1024, type: 'image/jpeg' }));
  assert.equal(validateImage({ size: 100, type: 'image/png' }), null);
});

check('zero-row update is treated as failure contract', () => {
  const requireRows = (data, msg) => (!data || (Array.isArray(data) && data.length === 0) ? { success: false, error: msg } : { success: true, data });
  assert.equal(requireRows([], 'fail').success, false);
  assert.equal(requireRows([{ id: '1' }], 'fail').success, true);
});

console.log(`\n${passed} product helper checks passed`);
