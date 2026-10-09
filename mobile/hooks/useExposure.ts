import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { ExposureScoreData } from '../services/api';

interface ExposureState {
  data: ExposureScoreData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * useExposure — fetches the authenticated user's personal exposure score,
 * badge gallery, streak, and commute comparison data.
 * Refreshes once on mount; call refresh() to re-fetch on demand.
 */
export function useExposure(): ExposureState {
  const [data, setData] = useState<ExposureScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getExposureScore();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch exposure score');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refresh: fetch };
}
