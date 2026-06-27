import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { AppError } from './errors.ts';

let serviceClient: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient;
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Missing Supabase service role configuration');
  serviceClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return serviceClient;
}

export function getUserClient(authHeader: string | null): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) throw new Error('Missing Supabase anon configuration');
  return createClient(url, anon, {
    global: { headers: authHeader ? { Authorization: authHeader } : {} },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getAuthUserId(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const client = getUserClient(authHeader);
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

export async function assertAdmin(authHeader: string | null): Promise<string> {
  const userId = await getAuthUserId(authHeader);
  if (!userId) throw new AppError('Yetkisiz erişim', 401, 'UNAUTHORIZED');
  const db = getServiceClient();
  const { data } = await db.from('profiles').select('role').eq('id', userId).single();
  if (!data || !['admin', 'super_admin'].includes(data.role)) {
    throw new AppError('Admin yetkisi gerekli', 403, 'FORBIDDEN');
  }
  return userId;
}
