import { apiClient } from '@/lib/apiClient';
import type { Product } from '@/types';

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export interface PaginatedProducts {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
  isActive?: boolean;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export async function getProducts(params: ProductListParams = {}): Promise<PaginatedProducts> {
  return apiClient.get<PaginatedProducts>(`/api/products${buildQuery(params as Record<string, string | number | boolean | undefined>)}`);
}

export async function getProduct(slug: string): Promise<Product> {
  return apiClient.get<Product>(`/api/products/${slug}`);
}

export async function getRelated(productId: string, limit = 4): Promise<Product[]> {
  return apiClient.get<Product[]>(`/api/products/${productId}/related?limit=${limit}`);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const result = await getProducts({ search: query, limit: 50 });
  return result.items;
}

export async function getCategories(): Promise<CategoryDto[]> {
  return apiClient.get<CategoryDto[]>('/api/categories');
}

export async function getCategory(slug: string): Promise<CategoryDto> {
  return apiClient.get<CategoryDto>(`/api/categories/${slug}`);
}

// Admin
export async function adminGetProducts(params: ProductListParams & { includeInactive?: boolean; lowStock?: boolean } = {}) {
  return apiClient.get<PaginatedProducts>(
    `/api/admin/products${buildQuery({
      ...params,
      includeInactive: params.includeInactive ? 'true' : undefined,
      lowStock: params.lowStock ? 'true' : undefined,
    })}`,
  );
}

export async function adminCreateProduct(body: Record<string, unknown>) {
  return apiClient.post<Product>('/api/admin/products', body);
}

export async function adminUpdateProduct(id: string, body: Record<string, unknown>) {
  return apiClient.patch<Product>(`/api/admin/products/${id}`, body);
}

export async function adminDeleteProduct(id: string) {
  return apiClient.delete<Product>(`/api/admin/products/${id}`);
}

export async function adminGetCategories() {
  return apiClient.get<CategoryDto[]>('/api/admin/categories');
}

export async function adminCreateCategory(body: Record<string, unknown>) {
  return apiClient.post<CategoryDto>('/api/admin/categories', body);
}

export async function adminUpdateCategory(id: string, body: Record<string, unknown>) {
  return apiClient.patch<CategoryDto>(`/api/admin/categories/${id}`, body);
}

export async function adminDeleteCategory(id: string) {
  return apiClient.delete<CategoryDto>(`/api/admin/categories/${id}`);
}
