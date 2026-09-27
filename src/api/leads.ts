import { Lead } from '../types';

// Resolves environment variables seamlessly in Vite (VITE_*) and CRA/Webpack (REACT_APP_*)
const resolveEnv = (viteKey: string, craKey: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    return import.meta.env[viteKey] as string;
  }
  if (typeof process !== 'undefined' && process.env && process.env[craKey]) {
    return process.env[craKey] as string;
  }
  return fallback;
};

const API_BASE_URL = resolveEnv('VITE_API_URL', 'REACT_APP_API_URL', 'http://localhost:8000/api/v1');
const API_KEY = resolveEnv('VITE_WORKSPACE_API_KEY', 'REACT_APP_WORKSPACE_API_KEY', '');

export interface FetchLeadsParams {
  tier?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LeadsApiResponse {
  leads: Lead[];
  total_count: number;
  kpis: {
    total_processed: number;
    hot_count: number;
    icp_fit_rate: number;
    avg_score: number;
  };
}

export async function fetchLeads(params: FetchLeadsParams): Promise<LeadsApiResponse> {
  const queryParams = new URLSearchParams();
  if (params.tier && params.tier !== 'all') queryParams.append('tier', params.tier);
  if (params.search) queryParams.append('search', params.search);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/leads?${queryParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch leads: ${response.statusText}`);
  }

  return response.json();
}
