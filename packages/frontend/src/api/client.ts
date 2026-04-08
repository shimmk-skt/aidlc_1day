let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) { accessToken = token; }
export function getAccessToken() { return accessToken; }

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
  if (!res.ok) { accessToken = null; return null; }
  const data = await res.json();
  accessToken = data.accessToken;
  return accessToken;
}

export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers as Record<string, string> };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  let res = await fetch(url, { ...options, headers, credentials: 'include' });

  if (res.status === 401 && accessToken) {
    if (!refreshPromise) refreshPromise = refreshAccessToken();
    const newToken = await refreshPromise;
    refreshPromise = null;
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers, credentials: 'include' });
    } else {
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Session expired');
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.message || `HTTP ${res.status}`), { status: res.status, body });
  }
  return res.json();
}
