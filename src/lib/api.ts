import { FunctionsHttpError } from '@supabase/supabase-js';
import { requireSupabase } from '@/lib/supabase';
import { ensureCartSessionId } from '@/lib/apiClient';

export class SupabaseApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'REQUEST_FAILED', status = 400) {
    super(message);
    this.name = 'SupabaseApiError';
    this.code = code;
    this.status = status;
  }
}

export function normalizeSupabaseError(error: unknown): SupabaseApiError {
  if (error instanceof SupabaseApiError) return error;
  if (error instanceof FunctionsHttpError) {
    return new SupabaseApiError(error.message, 'FUNCTION_ERROR', 400);
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return new SupabaseApiError(String((error as { message: string }).message));
  }
  return new SupabaseApiError('İstek başarısız oldu.');
}

interface FunctionEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { message: string; code: string };
}

export async function invokeFunction<T>(name: string, body: Record<string, unknown> = {}): Promise<T> {
  const client = requireSupabase();
  const sessionId = ensureCartSessionId();
  const { data: sessionData } = await client.auth.getSession();
  const token = sessionData.session?.access_token;

  const { data, error } = await client.functions.invoke<FunctionEnvelope<T>>(name, {
    body,
    headers: {
      'X-Cart-Session-Id': sessionId,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (error) throw normalizeSupabaseError(error);

  const envelope = data as FunctionEnvelope<T> | null;
  if (!envelope?.success) {
    throw new SupabaseApiError(
      envelope?.error?.message ?? 'Edge Function hatası',
      envelope?.error?.code ?? 'FUNCTION_ERROR',
    );
  }

  return envelope.data as T;
}

export async function invokeFunctionRaw<T>(name: string, body: Record<string, unknown> = {}): Promise<T> {
  return invokeFunction<T>(name, body);
}
