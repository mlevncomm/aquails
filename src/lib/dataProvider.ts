export type DataProvider = 'supabase' | 'express';

export function getDataProvider(): DataProvider {
  const v = import.meta.env.VITE_DATA_PROVIDER;
  return v === 'express' ? 'express' : 'supabase';
}

export const isSupabaseMode = getDataProvider() !== 'express';
export const isExpressMode = getDataProvider() === 'express';
