/**
 * Helper to resolve the correct API base URL.
 * When running in a web browser / full-stack Vite+Express server, relative paths like '/api/...' work out-of-the-box.
 * When running inside a native mobile wrapper (e.g. Capacitor / iOS / Android),
 * VITE_API_BASE_URL can be set to point to your live deployed backend service (e.g., https://your-cloud-run-domain.run.app).
 */
export const getApiBaseUrl = (): string => {
  // If explicitly defined in environment config (useful for mobile builds)
  const envBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (envBase) {
    return envBase.replace(/\/+$/, '');
  }

  // When deployed in browser/cloud, default to relative path
  return '';
};

export const apiUrl = (path: string): string => {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
