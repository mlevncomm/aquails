import { useEffect, useState } from 'react';
import type { Product, Category } from '@/types';
import { getProducts, getCategories, getProduct, getRelated } from '@/services/productService';

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [loadedProducts, loadedCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (cancelled) return;

        const counts = loadedProducts.reduce<Record<string, number>>((acc, p) => {
          acc[p.categorySlug] = (acc[p.categorySlug] ?? 0) + 1;
          return acc;
        }, {});

        setProducts(loadedProducts);
        setCategories(
          loadedCategories.map((cat) => ({
            ...cat,
            productCount: counts[cat.id] ?? cat.productCount,
          }))
        );
      } catch {
        if (!cancelled) setError('Ürün kataloğu yüklenemedi.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, categories, loading, error };
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | undefined>();
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setProduct(undefined);
      setRelated([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const loaded = await getProduct(slug);
      if (cancelled) return;

      setProduct(loaded);
      if (loaded) {
        const relatedProducts = await getRelated(loaded.id);
        if (!cancelled) setRelated(relatedProducts);
      } else {
        setRelated([]);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, related, loading };
}
