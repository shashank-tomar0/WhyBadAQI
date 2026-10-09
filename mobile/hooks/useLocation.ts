import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  coords: { latitude: number; longitude: number } | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * useLocation — requests foreground location permission and watches the user's
 * current position. Returns null coords with an error string if denied.
 * Falls back to New Delhi city centre (28.6139, 77.2090) on error so the app
 * remains functional even without precise GPS.
 */
export function useLocation(): LocationState & { refresh: () => void } {
  const [state, setState] = useState<LocationState>({
    coords: null,
    accuracy: null,
    error: null,
    loading: true,
  });
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const start = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setState({
        coords: { latitude: 28.6139, longitude: 77.2090 }, // Delhi fallback
        accuracy: null,
        error: 'Location permission denied — using Delhi city centre',
        loading: false,
      });
      return;
    }

    // Get a quick one-shot fix first
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setState({
        coords: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
        accuracy: loc.coords.accuracy,
        error: null,
        loading: false,
      });
    } catch {
      setState(s => ({ ...s, loading: false, error: 'Could not determine location' }));
    }

    // Then subscribe to updates
    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 100 },
      (loc) => {
        setState({
          coords: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
          accuracy: loc.coords.accuracy,
          error: null,
          loading: false,
        });
      }
    );
  }, []);

  useEffect(() => {
    start();
    return () => { watchRef.current?.remove(); };
  }, [start]);

  return { ...state, refresh: start };
}
