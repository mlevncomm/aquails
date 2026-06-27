const DEFAULT_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

export function getAllowedOrigins(): string[] {
  const appUrl = Deno.env.get('VITE_APP_URL') ?? Deno.env.get('APP_URL');
  if (appUrl) return [...DEFAULT_ORIGINS, appUrl.replace(/\/$/, '')];
  return DEFAULT_ORIGINS;
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = getAllowedOrigins();
  const resolved = origin && allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': resolved,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cart-session-id',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  };
}

export function handleOptions(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('Origin')) });
  }
  return null;
}
