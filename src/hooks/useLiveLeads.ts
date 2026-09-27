import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { fetchLeads, FetchLeadsParams } from '../api/leads';

const resolveEnv = (viteKey: string, craKey: string, fallback: string = ''): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    return import.meta.env[viteKey] as string;
  }
  if (typeof process !== 'undefined' && process.env && process.env[craKey]) {
    return process.env[craKey] as string;
  }
  return fallback;
};

const SUPABASE_URL = resolveEnv('VITE_SUPABASE_URL', 'REACT_APP_SUPABASE_URL', '');
const SUPABASE_ANON_KEY = resolveEnv('VITE_SUPABASE_ANON_KEY', 'REACT_APP_SUPABASE_ANON_KEY', '');

// Initialize Supabase Client for Realtime Subscriptions
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export function useLiveLeads(params: FetchLeadsParams, workspaceId: string) {
  const queryClient = useQueryClient();

  // 1. Primary Query: Fetches lead data with auto-refresh every 30 seconds
  const query = useQuery({
    queryKey: ['leads', workspaceId, params],
    queryFn: () => fetchLeads(params),
    refetchInterval: 30000, // 30-second background polling fallback
    staleTime: 10000,
    enabled: Boolean(workspaceId),
  });

  // 2. Realtime Listener: Listens for INSERT/UPDATE events directly on the PostgreSQL 'leads' table
  useEffect(() => {
    if (!supabase || !workspaceId) return;

    const channel = supabase
      .channel(`realtime-leads:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          console.log('🔥 New Live Lead Received:', payload.new);
          
          // Instantly invalidate TanStack Query cache to re-trigger interface render
          queryClient.invalidateQueries({ queryKey: ['leads', workspaceId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, queryClient]);

  return query;
}
