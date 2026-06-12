import { products, getProductBySlug, getRelatedProducts } from '@/data/products';
import type { Product } from '@/types';

export function getProducts(): Promise<Product[]> {
  return Promise.resolve([...products]);
}

export function getProduct(slug: string): Promise<Product | undefined> {
  return Promise.resolve(getProductBySlug(slug));
}

export function getRelated(productId: string, limit?: number): Promise<Product[]> {
  return Promise.resolve(getRelatedProducts(productId, limit));
}

export function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  return Promise.resolve(products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
}
