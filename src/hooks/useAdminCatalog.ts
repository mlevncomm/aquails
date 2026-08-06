import { useCallback, useEffect, useState } from 'react';
import { getAdminProducts, type AdminProduct } from '@/services/productService';
import { getCategoryOptions } from '@/services/productService';

export function useAdminCatalog() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    const [productsResult, cats] = await Promise.all([getAdminProducts(), getCategoryOptions()]);
    if (!productsResult.ok) {
      setProducts([]);
      setError(productsResult.error);
      setErrorCode(productsResult.code);
      setCategories(cats);
      setLoading(false);
      return;
    }
    setProducts(productsResult.products);
    setCategories(cats);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    products,
    categories,
    loading,
    error,
    errorCode,
    isEmpty: !loading && !error && products.length === 0,
    reload,
  };
}
