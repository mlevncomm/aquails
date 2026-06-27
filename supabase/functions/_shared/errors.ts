import { corsHeaders } from './cors.ts';

export class AppError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 400, code = 'REQUEST_FAILED') {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export function jsonError(error: unknown, origin: string | null): Response {
  const base = corsHeaders(origin);
  if (error instanceof AppError) {
    return new Response(JSON.stringify({ success: false, error: { message: error.message, code: error.code } }), {
      status: error.status,
      headers: { ...base, 'Content-Type': 'application/json' },
    });
  }
  console.error(error);
  return new Response(JSON.stringify({ success: false, error: { message: 'Sunucu hatası', code: 'INTERNAL_ERROR' } }), {
    status: 500,
    headers: { ...base, 'Content-Type': 'application/json' },
  });
}

export function jsonOk<T>(data: T, origin: string | null, status = 200): Response {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}
