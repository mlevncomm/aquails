import type { PublicProductDto } from '../../lib/serialize.js';

export interface PaginatedProducts {
  items: PublicProductDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
