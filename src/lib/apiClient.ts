const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: { message: string; code: string; details?: unknown };
}

function getCartSessionId(): string | null {
  return localStorage.getItem('aquails_cart_session');
}

export function ensureCartSessionId(): string {
  let sessionId = getCartSessionId();
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('aquails_cart_session', sessionId);
  }
  return sessionId;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('aquails_token');
  const sessionId = getCartSessionId();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (sessionId) headers.set('X-Cart-Session-Id', sessionId);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let payload: ApiSuccess<T> | ApiFailure;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError('Sunucuya bağlanılamadı.', 'NETWORK_ERROR', response.status || 0);
  }

  if (!payload.success) {
    throw new ApiError(
      payload.error?.message || 'İstek başarısız oldu.',
      payload.error?.code || 'REQUEST_FAILED',
      response.status,
    );
  }

  return payload.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { API_BASE };
