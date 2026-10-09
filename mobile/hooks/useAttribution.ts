import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { LiveAttributionData } from '../services/api';

interface UseAttributionOptions {
  lat?: number;
  lon?: number;
  /** Time offset in hours (for forecast scrubbing) */
  timeOffset?: number;
  /** Auto-refresh interval ms (default 120000 = 2 min) */
  refreshInterval?: number;
}

interface AttributionState {
  data: LiveAttributionData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

/**
 * useAttribution — fetches live or forecast source attribution data.
 * Auto-refreshes on a configurable interval. Returns offline mock data
 * gracefully when the backend is unreachable.
 */
export function useAttribution({
  lat = 28.6139,
  lon = 77.2090,
  timeOffset = 0,
  refreshInterval = 120_000,
}: UseAttributionOptions = {}): AttributionState {
  const [data, setData] = useState<LiveAttributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getLiveAttribution(lat, lon, timeOffset);
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch attribution data');
    } finally {
      setLoading(false);
    }
  }, [lat, lon, timeOffset]);

  useEffect(() => {
    fetch();
    const timer = setInterval(fetch, refreshInterval);
    return () => clearInterval(timer);
  }, [fetch, refreshInterval]);

  return { data, loading, error, lastUpdated, refresh: fetch };
}
